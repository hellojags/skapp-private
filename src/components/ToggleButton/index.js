import { useState } from 'react'
import { ReactComponent as Moon } from '../../assets/img/icons/moon.svg'
import { ReactComponent as Sun } from '../../assets/img/icons/sun.svg'
import './index.css'

const ToggleButton = ({toggle, setToggle}) => {
    let box = document.querySelector('.box')
    let ball = document.querySelector('.ball')

    const handleChange = (e) => {
        //   conditions to apply when checkbox is checked
      
        setToggle(!toggle);

        if (e.target.checked == true) {
            box.setAttribute('style', 'background-color:black;')
            ball.setAttribute('style', 'transform:translatex(100%);')
          }
        
          //   conditions to apply when checkbox is unchecked
        
          if (e.target.checked == false) {
            box.setAttribute('style', 'background-color:black; color:white;')
            ball.setAttribute('style', 'transform:translatex(0%);')
          }
    }

    return (
        <div class="toggleButtonContainer">
            <div class="btn">
                <input type="checkbox" name="check" id="check" onChange={(e) => handleChange(e)} />
                <label for="check">
                    <div class="box">
                        <div class="ball"></div>

                        <div class="scenary">
                            <div class="moon">
                                <Moon />
                            </div>
                            <div class="sun">
                                <Sun />
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default ToggleButton;