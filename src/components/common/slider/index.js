import React from 'react';
import './style.scss';

const Slider = ({value}) => {
    return (
        <div className="slider editable pinned pressed">
            <div className="container">
                <div className="knob" style={{left: "calc(" + value + "% - 1.6rem)"}}>
                    <div className="innerknob" data-value={value+"%"} ></div>
                </div>
                <div className="progress">
                    <div className="linear innerprogress">
                        <div>
                            <span className="value" style={{transform: "scaleX(" + value / 100 + ")"}} />
                        </div>
                    </div>
                    <div className="snaps">
                        <div className="snap"></div>
                        <div className="snap"></div>
                        <div className="snap"></div>
                        <div className="snap"></div>
                        <div className="snap"></div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Slider;