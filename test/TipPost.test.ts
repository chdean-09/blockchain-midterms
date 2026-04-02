import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TipPost", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const tipPost = await hre.ethers.deployContract("TipPost");
    return { tipPost, owner, user1, user2 };
  }

  describe("createPost", function () {
    it("should create a post with correct data and emit PostCreated", async function () {
      const { tipPost, owner } = await loadFixture(deployFixture);

      const tx = await tipPost.createPost(
        "https://picsum.photos/600/400",
        "Hello World"
      );
      const receipt = await tx.wait();
      const block = await hre.ethers.provider.getBlock(receipt!.blockNumber);

      await expect(tx)
        .to.emit(tipPost, "PostCreated")
        .withArgs(
          1,
          owner.address,
          "https://picsum.photos/600/400",
          "Hello World",
          block!.timestamp
        );

      const post = await tipPost.posts(1);
      expect(post.id).to.equal(1);
      expect(post.creator).to.equal(owner.address);
      expect(post.imageUrl).to.equal("https://picsum.photos/600/400");
      expect(post.caption).to.equal("Hello World");
      expect(post.likes).to.equal(0);
      expect(post.totalEarned).to.equal(0);
      expect(await tipPost.postCount()).to.equal(1);
    });

    it("should revert if image URL is empty", async function () {
      const { tipPost } = await loadFixture(deployFixture);

      await expect(
        tipPost.createPost("", "Some caption")
      ).to.be.revertedWith("Image URL cannot be empty");
    });

    it("should revert if caption is empty", async function () {
      const { tipPost } = await loadFixture(deployFixture);

      await expect(
        tipPost.createPost("https://picsum.photos/600/400", "")
      ).to.be.revertedWith("Caption cannot be empty");
    });
  });

  describe("likePost", function () {
    it("should like a post and transfer ETH to creator", async function () {
      const { tipPost, user1, user2 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://picsum.photos/600/400", "Post by user1");

      const likeCost = await tipPost.likeCost();

      await expect(
        tipPost.connect(user2).likePost(1, { value: likeCost })
      ).to.changeEtherBalance(user1, likeCost);

      const post = await tipPost.posts(1);
      expect(post.likes).to.equal(1);
      expect(post.totalEarned).to.equal(likeCost);
      expect(await tipPost.totalEarnedByUser(user1.address)).to.equal(
        likeCost
      );
      expect(await tipPost.hasLiked(1, user2.address)).to.equal(true);
    });

    it("should emit PostLiked event on successful like", async function () {
      const { tipPost, user1, user2 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://picsum.photos/600/400", "Post by user1");

      const likeCost = await tipPost.likeCost();

      await expect(
        tipPost.connect(user2).likePost(1, { value: likeCost })
      )
        .to.emit(tipPost, "PostLiked")
        .withArgs(1, user2.address, user1.address, 1, likeCost);
    });

    it("should revert if user tries to like the same post twice", async function () {
      const { tipPost, user1, user2 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://picsum.photos/600/400", "Post");

      const likeCost = await tipPost.likeCost();
      await tipPost.connect(user2).likePost(1, { value: likeCost });

      await expect(
        tipPost.connect(user2).likePost(1, { value: likeCost })
      ).to.be.revertedWith("Already liked this post");
    });

    it("should revert if creator tries to like their own post", async function () {
      const { tipPost, user1 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://picsum.photos/600/400", "My post");

      const likeCost = await tipPost.likeCost();

      await expect(
        tipPost.connect(user1).likePost(1, { value: likeCost })
      ).to.be.revertedWith("Cannot like your own post");
    });

    it("should revert if incorrect ETH amount is sent", async function () {
      const { tipPost, user1, user2 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://picsum.photos/600/400", "Post");

      await expect(
        tipPost
          .connect(user2)
          .likePost(1, { value: hre.ethers.parseEther("0.001") })
      ).to.be.revertedWith("Must send exactly 0.0001 ETH");
    });

    it("should revert if post does not exist", async function () {
      const { tipPost, user1 } = await loadFixture(deployFixture);

      const likeCost = await tipPost.likeCost();

      await expect(
        tipPost.connect(user1).likePost(999, { value: likeCost })
      ).to.be.revertedWith("Post does not exist");
    });
  });

  describe("View functions", function () {
    it("should return all posts via getAllPosts", async function () {
      const { tipPost, user1, user2 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://img1.com/pic.jpg", "First post");
      await tipPost
        .connect(user2)
        .createPost("https://img2.com/pic.jpg", "Second post");

      const allPosts = await tipPost.getAllPosts();
      expect(allPosts.length).to.equal(2);
      expect(allPosts[0].caption).to.equal("First post");
      expect(allPosts[0].creator).to.equal(user1.address);
      expect(allPosts[1].caption).to.equal("Second post");
      expect(allPosts[1].creator).to.equal(user2.address);
    });

    it("should check if a user has liked a post via checkLiked", async function () {
      const { tipPost, user1, user2 } = await loadFixture(deployFixture);

      await tipPost
        .connect(user1)
        .createPost("https://img1.com/pic.jpg", "A post");

      const likeCost = await tipPost.likeCost();

      expect(await tipPost.checkLiked(1, user2.address)).to.equal(false);

      await tipPost.connect(user2).likePost(1, { value: likeCost });

      expect(await tipPost.checkLiked(1, user2.address)).to.equal(true);
    });
  });
});
