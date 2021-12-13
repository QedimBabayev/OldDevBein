import React, { Component } from "react";
import { Modal, Button } from "antd";
import { connect } from "react-redux";
import Trans from "../usetranslation/Trans";
import { deleteResponseService } from "../actions/putAactions/deleteResponseService";
import { putLocalStates } from "../actions/modalActions/putModalInputs-action";
import {
  getCustomers,
  getCustomersFast,
} from "../actions/getCustomerGroups-action";
import getMarks from "../actions/getMarks-action";
import { getGroups } from "../actions/getGroups-action";
import {
  getCustomerGroupsModal,
  getStocksGroupsModal,
  productModalFilter,
  getProductsModal,
  getProductsGroupModal,
} from "../actions/modalActions/getCustomerGroupsModal-action";
import CreateCustomerModal from "../modal/CreateCustomerModal";
import CreateStockModal from "../modal/CreateStockModal";
import { docFilter } from "../config/filter";
import { createNewDocId } from "../actions/putAactions/saveDocument";
import { ConvertFixedTable } from "../Function/convertNumberDecimal";
import { poistionArray, description } from "../components/DocTable";
import {
  getCustomersData,
  updateCustomerSelect,
} from "../actions/getCustomerGroups-action";
import LoaderDocHOC from "../components/LoaderDocHOC";
import LoaderHOC from "../components/LoaderHOC";
import putData from "../actions/putAactions/putData-action";
import Sound from "react-sound";
import ok from "../audio/ok.mp3";
import { getToken } from "../config/token";
import {
  saveDocument,
  progress,
  isCreated,
} from "../actions/putAactions/saveDocument";
import { API_BASE } from "../config/env";
import axios from "axios";

import moment from "moment";
import {
  Form,
  Input,
  Drawer,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  DatePicker,
  Switch,
  Select,
  Spin,
  Tag,
  Divider,
  Menu,
  Col,
  Row,
  Collapse,
  message,
} from "antd";

import {
  PrinterOutlined,
  UserAddOutlined,
  PlusOutlined,
  HomeOutlined,
  EditOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Null_Content } from "../config/env";
import AddStockModal from "../modal/AddStockModal";
import "../components/ButtonsWrapper.css";
import "../components/DocForm.css";
const { Option, OptGroup } = Select;
const { TextArea } = Input;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
var customCascaderStock = [];
var customCascaderCustomer = [];
var newArrCustomers = [];
var lowerCaseMarks = [];
var lowerCaseCustomers = [];
var sendObject = {};
export class PaymentFrom extends Component {
  formRef = React.createRef();
  state = {
    visibleCustomer: false,
    visibleStock: false,
    visibleCatalog: false,
    selectOffice: false,
    newDocId: "",
    selectedCustomerId: "",
    createdCustomerName: "",
    createdCustomerId: "",
    customerCreate: false,
    customerEdit: false,
    editMarkColor: "",
    selectedMarkId: "",
    editMarkName: "",
    editMarkId: "",
    createdMarkId: "",
    createdMarkName: "",
    createdMarkColor: "",
    markEdit: false,
    markCreate: false,
    markLoading: false,
    markEditVisible: false,
    loadingButton: false,
    defaultDoc: this.props.doc,
  };

  async putPayment(object) {
    const res = await axios.post(
      `${API_BASE}/${this.props.to}/put.php`,
      object
    );
    return await res;
  }
  async putPaymentName(object) {
    const res = await axios.post(
      `${API_BASE}/${this.props.to}/newname.php`,
      object
    );
    return await res;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.state.datas.doc[0] != state.defaultDoc) {
      return {
        defaultDoc: props.doc,
      };
    }
    return null;
  }

  onFinish = (values) => {
    sendObject = {};
    this.progress(true);
    this.setState({
      loadingButton: true,
    });

    sendObject = values;
    if (!values.moment) {
      this.formRef.current.setFieldsValue(
        {
          moment: moment(),
        },
        () => {
          sendObject.moment = values.moment._d;
        }
      );
    } else {
      sendObject.moment = values.moment._d;
    }

    sendObject.moment = moment().format("YYYY-MM-DD HH:mm:ss");

    sendObject.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";

    if (this.state.selectedCustomerId === "") {
      delete sendObject["customerid"];
      sendObject.customerid = this.props.saledoc
        ? this.props.saledoc.selectCustomerName
          ? this.props.saledoc.selectCustomerId
          : this.props.saledoc.doc.CustomerId
        : this.props.doc.CustomerId;
    }
    if (this.state.createdCustomerId != "") {
      delete sendObject["customerid"];
      sendObject.customerid = this.state.createdCustomerId;
    }
    if (this.state.selectedMarkId === "") {
      delete sendObject["mark"];
      sendObject.mark = this.props.saledoc
        ? this.props.saledoc.doc.Mark
        : this.props.doc.Mark;
    } else if (this.state.selectedMarkId === null) {
      delete sendObject["mark"];
    } else {
      delete sendObject["mark"];
      sendObject.mark = this.state.selectedMarkId;
    }
    if (this.state.createdMarkId != "") {
      delete sendObject["mark"];
      sendObject.mark = this.state.createdMarkId;
    }
    this.props.state.savedoc.newDocId != ""
      ? (sendObject.id = this.props.state.savedoc.newDocId)
      : (sendObject.id = values.id);

    var nameFilter = {
      token: sendObject.token,
      n: "",
    };
    this.putPaymentName(nameFilter).then((res) => {
      sendObject.name = res.data.Body.ResponseService;
      this.putPayment(sendObject).then((res) => {
        this.props.getCustomersData(sendObject.customerid);
        this.progress(
          false,
          res.data.Body.ResponseStatus,
          res.data.Body,
          "",
          "save"
        );
      });
    });
  };

  progress = (fetching, status, mess, arch, from) => {
    if (fetching) {
      message.loading("Yüklənir...");
    } else if (fetching === "error") {
      console.log("errora girdi");
      message.destroy();
      if (from === "save") {
        message.error(`Saxlanılmadı.. ${mess}`);
      } else if (from === "del") {
        message.error(`Silinmədi.. ${mess}`);
      }
    } else {
      message.destroy();
      if (status === "0") {
        this.setState({
          newProductId: mess.ResponseService,
        });
        if (this.state.archForm && this.state.isArchFunc) {
          if (arch === "archieve") {
            return message.success("Arxivə salındı");
          } else if (arch === "archievegancel") {
            return message.success("Arxivdən çıxarıldı");
          }
          return;
        } else if (from === "save") {
          message.success(`${this.props.message}`);
          this.props.handleCancel();
          this.setState(
            {
              status: true,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  status: false,
                });
              }, 3000);
            }
          );
        } else if (from === "del") {
          message.success("Silindi");
          this.setState({
            status: true,
          });
        }

        this.setState({
          editId: mess.responseService,
          loadingButton: false,
        });
      } else {
        if (from === "save") {
          message.error(`Saxlanılmadı.. ${mess}`);
        } else if (from === "del") {
          message.error(`Silinmədi.. ${mess}`);
        }

        this.setState({
          status: false,
          loadingButton: false,
        });
      }
    }
  };

  render() {
    newArrCustomers = [];
    customCascaderCustomer = [];
    const spendOptions = Object.values(this.props.state.spenditems.spendItems)
      .filter((item) => item.StaticName != "correct")
      .map((item) => (
        <Option
          key={item.Id}
          text={item.Name}
          disabled={
            this.state.selectOffice == true && item.StaticName === "buyproduct"
              ? true
              : false
          }
          staticname={item.StaticName}
          value={item.Id}
        >
          {item.Name}
        </Option>
      ));

    const customerOption = Object.values(this.props.state.groups.customers).map(
      (c) => (
        <Option key={c.Id} value={c.Id}>
          {c.Name}
        </Option>
      )
    );
    const markOptions = Array.isArray(this.props.state.marks.marks)
      ? Object.values(this.props.state.marks.marks).map((mark) => (
          <Option
            className="mark_option_wrapper"
            value={mark.Name}
            key={mark.Id}
          >
            <span>{mark.Name}</span>
            <span className="mark_option_icons_wrapper">
              <EditOutlined
                style={{ marginRight: "8px", color: "#0288d1" }}
                id={mark.Id}
                onClick={(e) =>
                  this.handleEditMark(e, mark.Id, mark.Name, mark.Color)
                }
              />
              <DeleteOutlined
                style={{ color: "red" }}
                onClick={(e) => this.handleDeleteMark(e, mark.Id)}
              />
            </span>
          </Option>
        ))
      : "";

    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        footer={[
          <Button key="back" onClick={this.props.handleCancel}>
            Bağla
          </Button>,
          <Button
            form="payForm"
            loading={this.state.loadingButton}
            htmlType="submit"
            type="primary"
          >
            Yadda saxla
          </Button>,
        ]}
      >
        {console.log("dataspro", this.props.doc)}
        <Form
          id="payForm"
          className="doc_forms"
          ref={this.formRef}
          name="basic"
          initialValues={{
            name: "",
            customerid: this.state.defaultDoc
              ? this.state.defaultDoc.CustomerName
              : "",
            status: this.props.doc
              ? this.props.doc.Status === 1
                ? true
                : false
              : true,
            spenditem: this.props.doc
              ? this.props.doc.SpendItem
              : this.props.state.spenditems.spendItems.find(
                  (s) => s.StaticName === "buyproduct"
                ).Id,
            amount: this.state.defaultDoc ? this.state.defaultDoc.Amount : 0,
            moment: this.props.doc ? moment(this.props.doc.Moment) : "",
            linkid: this.state.defaultDoc ? this.state.defaultDoc.Id : "",
            id: "",
            description: this.props.doc ? this.props.doc.Description : "",
            mark: this.props.doc
              ? this.props.state.marks.marks.find(
                  (m) => m.Id === this.props.doc.Mark
                )
                ? this.props.state.marks.marks.find(
                    (m) => m.Id === this.props.doc.Mark
                  ).Name
                : ""
              : "",
          }}
          layout="horizontal"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="form_total_top_wrapper">
            <Row className="top_wrapper_holder">
              <Col xs={24} md={24} xl={6}>
                <div className="first_form_wrapper">
                  <Form.Item
                    label={<Trans word={"PaymentOut Number"} />}
                    name="name"
                    className="doc_number_form_item"
                  >
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item
                    label={<Trans word={"Created Moment"} />}
                    name="moment"
                  >
                    <DatePicker
                      onSelect={this.timePickerBlur}
                      showTime={{ format: "HH:mm:ss" }}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label={<Trans word={"Description"} />}
                  >
                    <TextArea />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} md={24} xl={6}>
                <div className="second_form_wrapper">
                  <Form.Item label="Status" name="mark">
                    <Select
                      showSearch
                      showArrow={false}
                      filterOption={false}
                      allowClear={true}
                      className="customSelect"
                      onChange={this.handleMarkId}
                      onFocus={this.getMarks}
                      placeholder="Status"
                      notFoundContent={<Spin size="small" />}
                      loading={
                        this.props.state.marks.markLoading ? (
                          <Spin size="small" />
                        ) : (
                          ""
                        )
                      }
                      dropdownRender={(menu) => (
                        <div className="site-drawer-render-in-current-wrapper customDrawer">
                          {menu}
                          <Divider style={{ margin: "4px 0" }} />
                          <Drawer
                            title="Status adı"
                            placement="right"
                            closable={false}
                            onClose={this.handleCloseEditMark}
                            visible={this.state.markEditVisible}
                            getContainer={false}
                            style={{ position: "absolute" }}
                          >
                            <Input
                              style={{ width: "115px" }}
                              onChange={this.onChangeEditMark}
                              value={this.state.editMarkName}
                            />
                            <Input
                              type="color"
                              value={this.state.editMarkColor}
                              onChange={this.handleEditColorChange}
                            />
                            <Button
                              loading={this.state.markLoading}
                              onClick={this.editMark}
                            >
                              Yadda saxla
                            </Button>
                          </Drawer>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              padding: 8,
                              flexDirection: "column",
                            }}
                          >
                            <Input
                              style={{ flex: "auto" }}
                              placeholder="Status adı"
                              onChange={this.onNameChange}
                            />
                            <Input
                              type="color"
                              defaultValue="#0288d1"
                              onChange={this.handleColorChange}
                            />
                            <a
                              style={{
                                flex: "none",
                                padding: "8px",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={this.addItem}
                            >
                              <PlusOutlined /> Əlavə et
                            </a>
                          </div>
                        </div>
                      )}
                    >
                      {this.props.state.marks.markLoading ? [] : markOptions}
                    </Select>
                  </Form.Item>

                  <div className="plus_wrapper">
                    <Form.Item
                      label={<Trans word={"Partner"} />}
                      name="customerid"
                      style={{ margin: "0" }}
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa, müştəri seçin",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        className="doc_status_formitem_wrapper_col customSelect"
                        placeholder=""
                        onSearch={this.doSearch}
                        onFocus={this.getCustomers}
                        onChange={this.onChange}
                        filterOption={false}
                        disabled={this.props.saledoc ? true : false}
                        notFoundContent={<Spin size="small" />}
                        loading={
                          this.props.state.groups.loading ? (
                            <Spin size="small" />
                          ) : (
                            ""
                          )
                        }
                      >
                        {this.props.state.groups.loading ? "" : customerOption}
                      </Select>
                    </Form.Item>
                    <PlusOutlined
                      style={{
                        margin: "0",
                        display: this.props.saledoc ? "none" : "block",
                      }}
                      onClick={this.showDrawer}
                      className="add_elements"
                    />
                  </div>
                  <Spin
                    className="get_data_indicator"
                    indicator={antIcon}
                    spinning={this.props.state.groups.fetchData}
                  >
                    <p
                      style={{ marginTop: "4px" }}
                      className="customer_data_wrapper"
                    >
                      <Trans word={"Doc Borrow"} /> :{" "}
                      {this.props.state.groups.customerDebt != ""
                        ? ConvertFixedTable(
                            this.props.state.groups.customerDebt
                          )
                        : "0.00"}
                    </p>
                  </Spin>
                </div>
              </Col>
              <Col xs={24} md={24} xl={6}>
                <div className="second_form_wrapper">
                  <Form.Item
                    label="Keçirilib"
                    className="docComponentStatus"
                    name="status"
                    valuePropName="checked"
                  >
                    <Checkbox
                      name="status"
                      onChange={this.handleBarcodeSelect}
                    />
                  </Form.Item>

                  <Form.Item label="Xərc maddəsi" name="spenditem">
                    <Select
                      showSearch
                      className="customSelect"
                      placeholder="Xərc maddələri"
                      disabled={!this.state.selectOffice}
                      filterOption={(input, option) =>
                        option.text
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      notFoundContent={<span>{Null_Content}</span>}
                      loading={this.props.state.spenditems.fetching}
                    >
                      {spendOptions}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} md={24} xl={6}>
                <div className="second_form_wrapper">
                  <Form.Item
                    label={<Trans word={"AmountMoney"} />}
                    name="amount"
                    className="doc_number_form_item transactionMoneyIcon"
                  >
                    <Input
                      type="number"
                      step="any"
                      allowClear
                      onFocus={this.handleFocus}
                      addonAfter="₼"
                      min={0}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>

          <Form.Item hidden={true} label="id" name="id">
            <Input />
          </Form.Item>

          <Form.Item hidden={true} label="linkid" name="linkid">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => ({
  state,
  doc: state.datas.doc[0],
});

const mapDispatchToProps = {
  putData,
  getMarks,
  getCustomersData,
  isCreated,
  updateCustomerSelect,
  createNewDocId,
  saveDocument,
  deleteResponseService,
  getProductsModal,
  getProductsGroupModal,
  getGroups,
  getStocksGroupsModal,
  getCustomers,
  getCustomersFast,
  putLocalStates,
  getCustomerGroupsModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentFrom);
