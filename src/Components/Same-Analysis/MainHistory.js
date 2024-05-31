import React from 'react'
import History from './History'
import history from "./history.module.css";
import samechainStyle from "@/Components/Dashboard/samechaindashboard.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassChart, faShare, faUser } from '@fortawesome/free-solid-svg-icons';

function MainHistory() {
  return (
    <div className={history.maindiv}>
        <div>
        <div className={samechainStyle.stickyIcon}>
          <a href="/same-chain" className={samechainStyle.Instagra}>
          <FontAwesomeIcon icon={faShare} /> <div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cross Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon1}>
          <a href="/cross-chain" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faShare} /> <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Same Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon2}>
          <a href="/all-user-lists" className={samechainStyle.Instagram}>
            <FontAwesomeIcon icon={faUser} /> <div>Manage Labels</div>
          </a>
        </div>
      </div>
     <History/>
    </div>
  )
}

export default MainHistory
