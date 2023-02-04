import React, { useState, useEffect } from 'react';
import request from '../utils/make_server_request';
import { VIEW_ALL, VIEW_ME, VIEW_SPECIFIC } from '../utils/constants';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { Tooltip } from 'react-tooltip';
import Masonry from 'react-masonry-css';
import './PicGrid.scss';

function PicGrid(props) {
    const [pics, setPics] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (_id, setDeleting) => {
        setDeleting(true);

        try {
            await request(
                'DELETE',
                '/user/pic/' + _id,
                {},
                props.user.id
            );

            setDeleting(false);
            setPics(pics.filter(pic => pic._id !== _id));
        } catch (error) {
            setDeleting(false);
            console.error(error);
        }
    }

    useEffect(() => {
        setLoading(true);

        (async function () {
            try {
                const path = `/public/pics/${props.view === VIEW_ALL ? '' : props.userView}`;

                const data = await request(
                    'GET',
                    path,
                    null,
                    -1
                );

                setPics(data.sort((a, b) => new Date(b.date_created) - new Date(a.date_created)));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [props.view]);

    return (
        <>
            {loading && <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
            <Masonry
                breakpointCols={{
                    default: 3,
                    700: 2,
                    420: 1
                }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {
                    !loading &&
                    pics.map((pic, idx) =>
                        <div key={pic._id} className="grid-item">
                            <img
                                src={pic.pic_url}
                                alt={pic.pic_description}
                                className="pic"
                            />
                            <div className="pic_description">
                                {pic.pic_description}
                            </div>
                            <div className="pic_actions">
                                <img
                                    src={pic.user_avatar_url}
                                    alt={pic.user_login}
                                    className="user_avatar"
                                    id={`my-anchor-element-${idx}`}
                                    data-tooltip-content={`@${pic.user_login}`}
                                    data-tooltip-place="bottom"
                                    onClick={() => {
                                        if (props.user && pic.user_id === props.user.id) {
                                            props.handleView(VIEW_ME);
                                            props.handleUserView(props.user.id);
                                        } else {
                                            props.handleView(VIEW_SPECIFIC);
                                            props.handleUserView(pic.user_id);
                                        }
                                    }}
                                />
                                <Tooltip anchorId={`my-anchor-element-${idx}`} clickable />
                                <div className="action_buttons">
                                    <LikeButton
                                        pic={pic}
                                        user={props.user}
                                    />
                                    {
                                        props.user && pic.user_id === props.user.id &&
                                        <DeleteButton
                                            pic={pic}
                                            user={props.user}
                                            handleDelete={handleDelete}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </Masonry>
        </>
    );
}

export default PicGrid;
