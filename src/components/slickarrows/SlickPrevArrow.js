import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { Button } from '@material-ui/core'

const SlickPrevArrow = ({ onClick, toggle }) => {
    return (
        <Button onClick={onClick} className={`${toggle ? 'darkTagButton' : 'lightTagButton'} slickPrev`}>
            <ArrowBackIosIcon />
        </Button>
    )
}

export default SlickPrevArrow
