import React, { useState } from 'react';
import request from '../utils/make_server_request';
import './PostPicForm.scss';

function PostPicForm(props) {
    const [pic_url, setPicUrl] = useState('');
    const [pic_description, setPicDescription] = useState('');
    const [posting, setPosting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pic_url || !pic_description) return;

        setPosting(true);

        try {
            await request(
                'POST',
                '/user/pic',
                {
                    pic_url,
                    pic_description,
                },
                props.user.id
            );

            setPosting(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            setPosting(false);
        }
    }

    return (
        <div className="post_pic_form">
            <form onSubmit={handleSubmit} disabled>
                <input
                    type="text"
                    placeholder="Pic URL (required)"
                    value={pic_url}
                    onChange={(e) => setPicUrl(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Pic Description (required)"
                    value={pic_description}
                    onChange={(e) => setPicDescription(e.target.value)}
                />
                <button type="submit" disabled={posting}>
                    Post
                </button>
            </form>
        </div>
    );
}

export default PostPicForm;
