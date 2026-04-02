// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipPost {
    struct Post {
        uint256 id;
        address creator;
        string imageUrl;
        string caption;
        uint256 likes;
        uint256 totalEarned;
        uint256 timestamp;
    }

    uint256 public postCount;
    uint256 public likeCost = 0.0001 ether;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256) public totalEarnedByUser;

    event PostCreated(
        uint256 indexed id,
        address indexed creator,
        string imageUrl,
        string caption,
        uint256 timestamp
    );

    event PostLiked(
        uint256 indexed id,
        address indexed liker,
        address indexed creator,
        uint256 totalLikes,
        uint256 totalEarned
    );

    function createPost(
        string calldata _imageUrl,
        string calldata _caption
    ) external {
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");
        require(bytes(_caption).length > 0, "Caption cannot be empty");

        postCount++;
        posts[postCount] = Post({
            id: postCount,
            creator: msg.sender,
            imageUrl: _imageUrl,
            caption: _caption,
            likes: 0,
            totalEarned: 0,
            timestamp: block.timestamp
        });

        emit PostCreated(
            postCount,
            msg.sender,
            _imageUrl,
            _caption,
            block.timestamp
        );
    }

    function likePost(uint256 _postId) external payable {
        require(_postId > 0 && _postId <= postCount, "Post does not exist");
        require(msg.value == likeCost, "Must send exactly 0.0001 ETH");
        require(!hasLiked[_postId][msg.sender], "Already liked this post");
        require(
            posts[_postId].creator != msg.sender,
            "Cannot like your own post"
        );

        Post storage post = posts[_postId];
        post.likes++;
        post.totalEarned += msg.value;
        hasLiked[_postId][msg.sender] = true;
        totalEarnedByUser[post.creator] += msg.value;

        (bool success, ) = payable(post.creator).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        emit PostLiked(
            _postId,
            msg.sender,
            post.creator,
            post.likes,
            post.totalEarned
        );
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }

    function checkLiked(
        uint256 _postId,
        address _user
    ) external view returns (bool) {
        return hasLiked[_postId][_user];
    }
}
