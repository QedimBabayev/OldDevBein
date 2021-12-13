import React, { Component } from "react";
import { Button, message, Modal, Menu, Dropdown } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  isEdited,
  saveButton,
  saveButtonPayment,
} from "../actions/putAactions/saveDocument";
import updateChanged from "../actions/updateChanged-action";
import { updateUpperheader } from "../actions/getNavbar-action";
import { exitModal } from "../actions/updateStates-action";
import { updateSelectedRows } from "../actions/updateStates-action";
import { changeSubMenu } from "../actions/getNavbar-action";
import { getCheckPage } from "../actions/check/check-action";

import {
  updateSelectProductMultiConfirm,
  updateSendObject,
  submitForm,
} from "../actions/updateStates-action";
// import Sound from 'react-sound';
import { saveDoc } from "../actions/putAactions/saveBtn-action";
// import Ok from '../audio/ok.mp3'
import { duration } from "moment";
import {
  CheckSquareOutlined,
  PlusCircleOutlined,
  DownOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "./Doc.css";

class DocButtons extends React.Component {
  state = {
    redirect: false,
    send: false,
    isPlaying: false,
    visible: false,
    from: this.props.from,
    fromDoc: this.props.fromDoc,
    editId: null,
    newDocId: undefined,
    isCreated: false,
    toDoc: this.props.toDoc,
    toPage: false,
    returnPage: false,
    redirectExternal: false,
    redirectLinkedDoc: false,
    loading: false,
    disabledSave: true,
    ownUpdate: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.props.exitModal(
      false,
      this.props.state.stateChanges.fromvisible,
      this.props.state.stateChanges.name
    );
  };
  handleReturnPage = () => {
    this.props.exitModal(
      false,
      this.props.state.stateChanges.fromvisible,
      this.props.state.stateChanges.name
    );
    this.props.updateUpperheader(this.props.state.stateChanges.name);
    this.props.changeSubMenu(this.props.state.stateChanges.name);
    this.setState({
      redirect: true,
    });
  };
  handleCloseAlert = () => {
    message.destroy();
  };

  static getDerivedStateFromProps(props, state) {
    if (props.state.stateChanges.changed) {
      return {
        disabledSave: false,
      };
    }
    if (state.ownUpdate) {
      return {
        disabledSave: true,
        ownUpdate: false,
      };
    }
    return null; // No change to state
  }

  handleClearChanged = (e) => {
    window.scrollTo(0, 0);

    if (e.target.parentNode.id === "closeBtn" || e.target.id === "closeBtn") {
      this.props.updateSelectedRows([], []);
      this.props.getCheckPage(false);
      if (this.props.state.stateChanges.changed) {
        this.props.exitModal(
          true,
          this.props.state.stateChanges.fromvisible,
          this.props.state.stateChanges.name
            ? this.props.state.stateChanges.name
            : this.props.state.navbar.activeSubItem
        );
        return;
      } else {
        this.setState({
          returnPage: false,
          send: false,
        });
        this.setState({
          redirect: true,
        });
      }
    } else if (
      e.target.parentNode.id === "saveBtn" ||
      e.target.id === "saveBtn" ||
      e.target.id === "saveTrans"
    ) {
      this.setState({
        returnPage: false,
      });

      this.props.isEdited(true);
      this.props.updateSelectProductMultiConfirm(false, false, false);
      this.setState({ ownUpdate: true });
    } else if (e.target.parentNode.id === "newDropdown") {
    }
  };

  handleeSaveDocModal = () => {
    this.props.exitModal(
      false,
      this.props.state.stateChanges.fromvisible,
      this.props.state.stateChanges.name
        ? this.props.state.stateChanges.name
        : this.props.state.navbar.activeSubItem
    );
    this.props.updateUpperheader(this.props.state.stateChanges.name);
    this.setState({
      returnPage: true,
    });
  };
  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  };

  handlePayment = (e) => {
    if (this.props.from != "p=product" && this.props.from != "p=customer") {
      this.props.saveButton(true);
      this.props.saveButtonPayment(true);
      this.props.isEdited(true);
      this.props.updateSelectProductMultiConfirm(false, false, false);
    }
  };
  handleLinked = () => {
    this.setState({
      redirectLinkedDoc: true,
    });
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          push
          to={`/${
            this.props.state.stateChanges.fromvisible
              ? this.props.state.stateChanges.fromvisible
              : this.props.from
          }`}
        />
      );
    }

    if (this.state.redirectLinkedDoc) {
      return (
        <Redirect
          push
          to={{
            pathname: this.props.toLinked,
            state: {
              fromdoc: this.props.fromDoc,
              doc: this.props.doc[0],
            },
          }}
        />
      );
    }

    const menu = (
      <Menu>
        <Menu.Item
          key="0"
          disabled={
            !this.props.match.params.id
              ? this.props.state.savedoc.newDocId === ""
                ? true
                : false
              : false
          }
        >
          <Button
            onClick={this.handlePayment}
            id={"saveTrans"}
            htmlType={"submit"}
            form="myForm"
          >
            Ödəmə
          </Button>
        </Menu.Item>
        <Menu.Item
          key="1"
          disabled={
            !this.props.match.params.id
              ? this.props.state.savedoc.newDocId === ""
                ? true
                : false
              : false
          }
          onClick={this.handleLinked}
        >
          Qaytarma
        </Menu.Item>
        <Menu.Item
          key="2"
          disabled={
            !this.props.match.params.id
              ? this.props.state.savedoc.newDocId === ""
                ? true
                : false
              : false
          }
        >
          Sifariş
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="doc_header_buttons ">
        {Object.values(this.props.buttonsName)
          .filter((p) => p.id === "saveBtn")
          .map((p) => (
            <Button
              onClick={this.handleClearChanged}
              form={p.form}
              htmlType={"submit"}
              key={"submit"}
              disabled={this.state.disabledSave}
              className={p.className}
              id={p.id}
            >
              {p.title}
            </Button>
          ))}
        {Object.values(this.props.buttonsName)
          .filter((p) => p.id != "saveBtn")
          .map((p) =>
            p.icon ? (
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  htmlType={p.type}
                  key={p.id}
                  className={p.className}
                  icon={<DownOutlined />}
                  onClick={(e) => e.preventDefault()}
                >
                  {p.title}
                </Button>
              </Dropdown>
            ) : (
              <Button
                onClick={this.handleClearChanged}
                form={p.form}
                htmlType={p.type}
                key={p.id}
                className={p.className}
                id={p.id}
              >
                {p.title}
              </Button>
            )
          )}

        <Modal
          title={
            <div className="exitModalTitle">
              <WarningOutlined /> Diqqət
            </div>
          }
          closable={false}
          className="close_doc_modal_wrapper"
          visible={this.props.state.stateChanges.visible}
          footer={[
            <Button
              form="myForm"
              key="submit"
              htmlType="submit"
              onClick={this.handleeSaveDocModal}
            >
              Yadda saxla
            </Button>,
            <div className="close_doc_modal_right_side">
              <Button key="back" onClick={this.handleCancel}>
                Geri qayıt
              </Button>
              <Button
                key="link"
                href="#"
                onClick={this.handleReturnPage}
              >
                Ok
              </Button>
            </div>,
          ]}
        >
          <p className="exitModalBodyText">
            Dəyişikliklər yadda saxlanılmayacaq
          </p>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  updateChanged,
  saveButton,
  updateSelectProductMultiConfirm,
  updateSendObject,
  submitForm,
  saveDoc,
  exitModal,
  updateUpperheader,
  changeSubMenu,
  updateSelectedRows,
  isEdited,
  saveButtonPayment,
  getCheckPage,
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocButtons)
);
