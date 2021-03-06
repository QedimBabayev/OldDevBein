import React, { Component } from "react";
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
import { poistionArray, description } from "./DocTable";
import LoaderDocHOC from "./LoaderDocHOC";
import {
  getCustomersData,
  updateCustomerSelect,
} from "../actions/getCustomerGroups-action";
import { ConvertFixedTable } from "../Function/convertNumberDecimal";
import LoaderHOC from "./LoaderHOC";
import putData from "../actions/putAactions/putData-action";
import ok from "../audio/ok.mp3";
import { getToken } from "../config/token";
import {
  saveDocument,
  progress,
  isCreated,
} from "../actions/putAactions/saveDocument";
import { API_BASE } from "../config/env";
import axios from "axios";
import { changeForm } from "../actions/updateStates-action";
import moment from "moment";
import {
  Form,
  Input,
  Drawer,
  Button,
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
import "./ButtonsWrapper.css";
import "./DocForm.css";
import { soundLoader } from "../actions/putAactions/saveDocument";
import { saveButton } from "../actions/putAactions/saveDocument";
import Connection from "../modal/Connection";

const { Option, OptGroup } = Select;
const { TextArea } = Input;

var customCascaderStock = [];
var customCascaderCustomer = [];
var newArrCustomers = [];
var lowerCaseMarks = [];
var lowerCaseCustomers = [];
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const audio = new Audio(ok);

var sendObject = {};

class InvoiceInFormComponent extends Component {
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
    connection: false,
    redirectEditPage: false,
    status: false,
    sendRequest: false,
  };

  handleChangeStatus = (e) => {
    this.setState({ status: e.target.checked });
  };

  closeConnection = () => {
    this.setState({
      connection: false,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.state.savedoc.networkError &&
      nextProps.state.savedoc.networkError === "Network Error" &&
      nextProps.state.savedoc.networkError !=
        this.props.state.savedoc.networkError
    ) {
      this.props.saveButton(false);
      this.setState({
        connection: true,
      });
      return;
    }
    if (nextProps.state.putdatas.responseCustomerId.ResponseService) {
      if (
        nextProps.state.putdatas.responseCustomerId.ResponseService !=
        this.props.state.putdatas.responseCustomerId.ResponseService
      ) {
        this.setState(
          {
            customerCreate: true,
            createdCustomerId:
              nextProps.state.putdatas.responseCustomerId.ResponseService,
          },
          () => {
            this.formRef.current.setFieldsValue({
              customerid: nextProps.state.docmodals.localStates.name,
            });
          }
        );
      } else {
        this.setState({
          customerCreate: false,
        });
      }
    }

    if (nextProps.state.savedoc.docName) {
      if (nextProps.state.savedoc.docName != this.props.state.savedoc.docName) {
        this.formRef.current.setFieldsValue({
          name: nextProps.state.savedoc.docName,
        });
      }
    }

    if (nextProps.state.marks.newMarkId != "") {
      if (nextProps.state.marks.newMarkId != this.props.state.marks.newMarkId) {
        this.setState(
          {
            markCreate: true,
            createdMarkId: nextProps.state.marks.newMarkId,
          },
          () => {
            this.formRef.current.setFieldsValue({
              mark: this.state.createdMarkName,
            });
          }
        );
      } else {
        this.setState({
          markCreate: false,
        });
      }
    }

    if (nextProps.state.savedoc.newDocId != "") {
      if (
        nextProps.state.savedoc.newDocId != this.props.state.savedoc.newDocId
      ) {
        this.setState({
          sendRequest: false,
        });
        this.props.isCreated(false);
        this.props.soundLoader(false);
        audio.play();
        this.formRef.current.setFieldsValue({
          id: nextProps.state.savedoc.newDocId,
        });
      }
    }
  }
  componentDidMount = () => {
    this.props.createNewDocId("");
    var id = this.props.saledoc
      ? this.props.saledoc.doc.CustomerId
      : this.props.doc
      ? this.props.doc.CustomerId
      : "";
    this.props.getCustomersData(id);

    if (!this.props.doc) {
      this.formRef.current.setFieldsValue({
        moment: moment(),
      });
    }
  };
  showDrawer = () => {
    this.setState({
      visibleCustomer: true,
    });
    this.props.deleteResponseService();
    this.props.getCustomerGroupsModal();
    this.props.putLocalStates("");
  };

  showStockDrawer = () => {
    this.setState({
      visibleStock: true,
    });
    this.props.deleteResponseService();
    this.props.getStocksGroupsModal();
    this.props.putLocalStates("");
  };

  onClose = () => {
    this.setState({
      visibleCustomer: false,
    });
    this.props.getCustomers();
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
    this.props.getCustomerGroupsModal();
  };

  handleCreatedDoc = () => {
    this.props.isCreated(false);
  };
  handleMarkId = (value, option) => {
    delete sendObject["mark"];
    sendObject.mark = option ? option.key : null;
    this.setState({
      selectedMarkId: option ? option.key : null,
    });
  };
  onNameChange = (e) => {
    this.setState({
      createdMarkName: e.target.value,
    });
  };

  handleColorChange = (e) => {
    this.setState({
      createdMarkColor: e.target.value,
    });
  };

  handleEditColorChange = (e) => {
    this.setState({
      editMarkColor: e.target.value,
    });
  };

  onChangeEditMark = (e) => {
    this.setState({
      editMarkName: e.target.value,
    });
  };
  handleDeleteMark = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.delMark(id);
  };
  handleEditMark = (e, id, name, color) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      editMarkId: id,
      editMarkName: name,
      editMarkColor: color,
      markEditVisible: true,
    });
  };
  handleCloseEditMark = (e, id, name) => {
    this.props.getMarks();
    this.setState({
      editMarkId: "",
      editMarkName: "",
      editMarkColor: "",
      markEditVisible: false,
    });
  };

  editMark = () => {
    this.setState({
      markLoading: true,
    });
    var markFilter = {};
    markFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    markFilter.id = this.state.editMarkId;
    markFilter.name = this.state.editMarkName;
    markFilter.color = this.state.editMarkColor;
    this.editMarks(markFilter).then((d) =>
      this.setState({
        markLoading: false,
      })
    );
    this.handleCloseEditMark();
  };
  handleFocus = (event) => event.target.select();

  async editMarks(object) {
    const res = await axios.post(`${API_BASE}/marks/edit.php`, object);
    return await res;
  }
  addItem = () => {
    var markFilter = {};
    markFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    markFilter.name = this.state.createdMarkName;
    markFilter.color = this.state.createdMarkColor;
    this.props.putMark(markFilter);
  };
  doSearch = (value) => {
    this.props.getCustomersFast(value);
  };

  onChange = (value, option) => {
    delete sendObject["customerid"];
    sendObject.customerid = value;
    this.setState({
      selectedCustomerId: value,
    });

    this.props.getCustomersData(value);
    if (value === "00000000-0000-0000-0000-000000000000") {
      this.formRef.current.setFieldsValue({
        spenditem: this.props.state.spenditems.spendItems.find(
          (s) => s.StaticName === "correct"
        ).Id,
      });
    } else {
      this.formRef.current.setFieldsValue({
        spenditem: this.props.state.spenditems.spendItems.find(
          (s) => s.StaticName === "buyproduct"
        ).Id,
      });
    }
  };
  getMarks = () => {
    lowerCaseMarks = [];
    this.props.getMarks();
  };

  onChangeField = () => {
    this.props.changeForm(true);
  };
  onFinishFailed = () => {
    this.props.saveButton(false);
  };
  onFinish = (values) => {
    this.props.changeForm(false)
    sendObject = {};
    sendObject = values;
    if (!values.moment) {
      this.formRef.current.setFieldsValue(
        {
          moment: moment(),
        },
        () => {
          sendObject.moment = values.moment._d;
          sendObject.modify = values.moment._d;
        }
      );
    } else {
      sendObject.moment = values.moment._d;
      sendObject.modify = values.modify._i;
    }
    sendObject.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";

  
  if (
    this.props.doc &&
    this.props.doc.CustomerName ===
      this.formRef.current.getFieldValue("customerid")
  ) {
    sendObject.customerid = this.props.doc ? this.props.doc.CustomerId : "";
  } else {
    sendObject.customerid = this.formRef.current.getFieldValue("customerid");
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

    if (!this.state.sendRequest) {
      progress(true);
      this.props.saveDocument("invoiceins", sendObject);
    }
    this.setState({
      sendRequest: true,
    });
  };

  getCustomers = () => {
    this.setState({
      customerEdit: true,
    });
    newArrCustomers = [];
    this.props.getCustomers();
  };
  timePickerBlur = (time) => {
    //Ofc you can use state or whatever here :)
    this.formRef.current.setFieldsValue({
      moment: moment(time),
    });
  };
  render() {
    newArrCustomers = [];
    customCascaderCustomer = [];
    const spendOptions = Object.values(this.props.state.spenditems.spendItems)
      .filter((item) => item.StaticName === "buyproduct")
      .map((item) => (
        <Option
          key={item.Id}
          text={item.Name}
          staticname={item.StaticName}
          value={item.Id}
        >
          {item.Name}
        </Option>
      ));

    const customerOptions = Object.values(
      this.props.state.groups.customers
    ).map((customer) => (
      <Option
        key={customer.Id}
        disabled={
          customer.Id === "00000000-0000-0000-0000-000000000000" ? true : false
        }
        value={customer.Id}
      >
        {customer.Name}
      </Option>
    ));

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
      <>
        <Connection
          closeConnection={this.closeConnection}
          visible={this.state.connection}
        />
        <Form
          id="myForm"
          className="doc_forms"
          ref={this.formRef}
          name="basic"
          initialValues={{
            name: this.props.doc ? this.props.doc.Name : "",
            customerid: this.props.doc ? this.props.doc.CustomerName : "",
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
            amount: this.props.doc ? this.props.doc.Amount : 0,
            modify: this.props.doc ? moment(this.props.doc.Modify) : "",
            moment: this.props.doc ? moment(this.props.doc.Moment) : "",
            id: this.props.doc ? this.props.doc.Id : "",
            linkid: this.props.saledoc ? this.props.saledoc.Id : "",
            description: this.props.doc ? this.props.doc.Description : "",
            mark: this.props.doc
              ? this.props.state.marks.marks.find(
                  (m) => String(m.Id) === this.props.doc.Mark
                )
                ? this.props.state.marks.marks.find(
                    (m) => String(m.Id) === this.props.doc.Mark
                  ).Name
                : ""
              : "",
          }}
          layout="horizontal"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onFieldsChange={this.onChangeField}
        >
          <div className="form_total_top_wrapper">
            <Row className="top_wrapper_holder">
              <Col xs={24} md={24} xl={6}>
                <div className="first_form_wrapper">
                  <Form.Item
                    label={<Trans word={"InvoiceIn Number"} />}
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
                    label="D??yi??m?? tarixi"
                    name="modify"
                    className="modified_date_input"
                    style={{
                      display: this.props.docid != "" ? "flex" : "none",
                    }}
                  >
                    <DatePicker
                      disabled={true}
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
                      allowClear={true}
                      filterOption={false}
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
                            title="Status ad??"
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
                              placeholder="Status ad??"
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
                              <PlusOutlined /> ??lav?? et
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
                          message: "Z??hm??t olmasa, m????t??ri se??in",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        className="doc_status_formitem_wrapper_col customSelect"
                        placeholder=""
                        onSearch={this.doSearch}
                        disabled={this.props.saledoc ? true : false}
                        onFocus={this.getCustomers}
                        onChange={this.onChange}
                        filterOption={false}
                        notFoundContent={<span>{Null_Content}</span>}
                        notFoundContent={<Spin size="small" />}
                        loading={
                          this.props.state.groups.loading ? (
                            <Spin size="small" />
                          ) : (
                            ""
                          )
                        }
                      >
                        {this.props.state.groups.loading ? "" : customerOptions}
                      </Select>
                    </Form.Item>
                    <PlusOutlined
                      style={{
                        margin: "0",
                        display: this.props.saledoc ? "none" : "flex",
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
                    label="Ke??irilib"
                    className="docComponentStatus"
                    name="status"
                    valuePropName="checked"
                  >
                    <Checkbox
                      name="status"
                      onChange={this.handleBarcodeSelect}
                    ></Checkbox>
                  </Form.Item>
                  <Form.Item label="X??rc madd??si" name="spenditem">
                    <Select
                      showSearch
                      className="customSelect"
                      placeholder="X??rc madd??l??ri"
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
                      allowClear
                      onFocus={this.handleFocus}
                      addonAfter="???"
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
        <CreateCustomerModal
          from="createDemandReturn"
          visible={this.state.visibleCustomer}
          childrenDrawer={this.state.childrenDrawer}
          onClose={this.onClose}
          showChildrenDrawer={this.showChildrenDrawer}
          onChildrenDrawerClose={this.onChildrenDrawerClose}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  putData,
  getMarks,
  createNewDocId,
  getCustomersData,
  saveDocument,
  deleteResponseService,
  isCreated,
  getProductsModal,
  getProductsGroupModal,
  getGroups,
  getStocksGroupsModal,
  getCustomers,
  getCustomersFast,
  putLocalStates,
  getCustomerGroupsModal,
  saveButton,
  soundLoader,
  changeForm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoaderHOC(InvoiceInFormComponent, "datas"));
