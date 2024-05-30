import './NavBar.css';
import Icon from "@mdi/react";
import {mdiFlowerTulip, mdiGithub} from "@mdi/js";

function NavBar() {

    return (
        <div className="NavBar">
            <div></div>
            <div className="title-container">
                <h1 className="big-screen-title">Flower Plant Recognizer&nbsp;&nbsp;</h1>
                <h1 className="small-screen-title">FPR&nbsp;&nbsp;</h1>
                <Icon path={mdiFlowerTulip} size={2}></Icon>
            </div>
            <a href="https://github.com/curtisackland/flower-plant-recognizer" target="_blank"
               rel="noopener noreferrer">
                <Icon path={mdiGithub} size={2}></Icon>
            </a>
        </div>
);
}

export default NavBar;