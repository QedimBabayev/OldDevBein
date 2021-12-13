import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { updateSubheader } from "../actions/getNavbar-action";
import { updateZIndex, openSettingPage } from "../actions/updateStates-action";
import { logOut, ClearNav } from "../actions/putLogin-actions.js/logOut";
import axios from "axios";
import { API_BASE } from "../config/env";
import { openBalanceModal } from "../actions/updateStates-action";
import { Icon } from "semantic-ui-react";
import { IncreaseBalance } from "../modal/IncreaseBalance";
import Trans from "../usetranslation/Trans";
import { get } from "../socketApi";

// TODO: This is missing functionality for sub-menu here from SUI core examples.
// The "Publish To Web" item should contain a sub-menu.

const DropdownLogin = (props) => {
  const [balance, setBalance] = useState("");
  const [visible, setVisible] = useState(false);
  const balanceRef = useRef(null);

 

  const onOpen = () => {
    props.updateZIndex(true);
  };

  const onClose = () => {
    props.updateZIndex(false);
  };

  const openSettingPage = () => {
    props.openSettingPage(true);
    props.updateSubheader("", "");
  };
  const openBalance = () => {
    // props.openBalanceModal (true);
    setVisible(true);
  };
  const closeBalance = () => {
    setVisible(false);
  };

  const logOut = () => {
    props.logOut();
  };

  return (
    <>
      <IncreaseBalance closeBalance={closeBalance} visible={visible} />
      <Dropdown
        onOpen={onOpen}
        onClose={onClose}
        className="flex-direction-column-center admin_menu "
        text={
          <div className="admin_dropdown_text" style={{ flexDirection: "row" }}>
            <p
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                marginRight: "12px",
                marginBottom: "0",
              }}
            >
              {props.from === "comp" ? (
                <>
                  <span>
                    {props.state.profile.profile
                      ? props.state.profile.profile.CompanyName
                      : ""}
                  </span>
                  <span>
                    {JSON.parse(localStorage.getItem("user"))
                      ? JSON.parse(localStorage.getItem("user")).Login
                      : null}
                  </span>
                </>
              ) : (
                ""
              )}
            </p>
            <img
              style={{ margin: "0" }}
              className="small_logo_pics custom_width"
              src={`/images/newSetAdmin.png`}
            />
          </div>
        }
      >
        <Dropdown.Menu>
         
          <Dropdown.Item onClick={openSettingPage} as={Link} to={"/settings"}>
            <span>
              <Trans word="settings" />
            </span>
          </Dropdown.Item>
          <Dropdown.Item>
            <span>
              <Trans word="proclaims" />
            </span>
          </Dropdown.Item>
          <Dropdown.Item onClick={openBalance}>
            <span>
              <Trans word="balance" /> {localStorage.getItem('balance')} ₼
            </span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logOut} text={<Trans word={"logout"} />} />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  updateZIndex,
  logOut,
  ClearNav,
  openSettingPage,
  updateSubheader,
  openBalanceModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLogin);
