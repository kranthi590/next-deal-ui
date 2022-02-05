import React from "react";
const CustomTimeLineEvent = ({ icon: Icon, title, color = '#e0e0e0' }) => {
    return (
        <div className='gx-timeline-event'>
            <div className='container'>
                {Icon ? <Icon className="icon" /> : <></>}
                <svg width="160" height="140" viewBox='0 0 59.531 49.477'>
                    <g transform='matrix(.99959 0 0 .99838 -100.96 -38.57)'>
                        <path
                            d='M101.002 69.656h55.492l4.064 4.158-4.064 4.205h-55.492l3.85-4.205z'
                            fill={color}
                            strokeWidth="0.24"
                        />
                        <circle
                            cx="130.726"
                            cy="73.838"
                            r="1.522"
                            fill="#fff"
                            strokeWidth="0.15"
                        />
                        <circle
                            cx="130.78"
                            cy="48.202"
                            r="9.57"
                            fill={color}
                            strokeWidth="0.194"
                        />
                        <rect
                            width="0.794"
                            height="14.363"
                            x="130.383"
                            y="56.309"
                            ry="0"
                            fill={color}
                            strokeWidth="0.108"
                        />
                    </g>
                </svg>
                {
                    title ?
                        <div className='textContainer'>
                            {title}
                        </div>
                        : <></>
                }
            </div>
        </div>
    )
}

export default CustomTimeLineEvent