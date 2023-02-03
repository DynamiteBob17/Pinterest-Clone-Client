import React, { useState, useEffect } from 'react';
import request from '../utils/make_server_request';
import './LikeButton.scss';

function LikeButton(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        setLoading(true);

        try {
            await request(
                'PUT',
                `/user/like_pic/${props.pic._id}`,
                {},
                props.user.id
            );

            setLiked(true);
            setLikes(likes + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUnlike = async () => {
        setLoading(true);

        try {
            await request(
                'PUT',
                `/user/unlike_pic/${props.pic._id}`,
                {},
                props.user.id
            );

            setLiked(false);
            setLikes(likes - 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (props.user && props.pic.pic_likes.includes(props.user.id)) {
            setLiked(true);
        }

        setLikes(props.pic.pic_likes.length);
    }, []);

    return (
        <button
            className={"like_button"}
            onClick={liked ? handleUnlike : handleLike}
            disabled={!props.user || loading}
        >
            {
                loading ?
                    <div className="lds-hourglass"></div>
                    : <span
                        className={liked ? "liked" : ""}
                    >
                        <i className={`fa-${liked ? "solid" : "regular"} fa-heart`}></i>
                        {likes}
                    </span>
            }
        </button>
    );
}

export default LikeButton;
