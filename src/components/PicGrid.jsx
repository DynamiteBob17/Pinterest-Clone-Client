import React, { useState, useEffect } from 'react';
import request from '../utils/make_server_request';
import { VIEW_ALL, VIEW_ME, VIEW_SPECIFIC } from '../utils/constants';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
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

                setPics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [props.view]);

    return (
        <div className="grid">
            {
                loading
                    ? <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    : pics.map((pic, idx) =>
                        <div key={idx} className="grid-item">
                            <img
                                src={pic.pic_url}
                                alt={pic.pic_description}
                            />
                            <div className="pic_description">
                                {pic.pic_description}
                            </div>
                            <div className="pic_actions">
                                <img
                                    src={pic.user_avatar_url}
                                    alt={pic.user_login}
                                    title={'@' + pic.user_login}
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
                    )
            }
        </div>
    );
}

export default PicGrid;
