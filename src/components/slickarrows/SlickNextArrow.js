import React from 'react'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Button } from '@material-ui/core'
const SlickNextArrow = ({ onClick, toggle }) => {
    return (
        <Button onClick={onClick} className={`${toggle ? 'darkTagButton' : 'lightTagButton'} slickNex`}>
            <ArrowForwardIosIcon />
        </Button>
    )
}

export default SlickNextArrow
