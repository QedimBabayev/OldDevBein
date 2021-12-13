import React, { Component } from "react";
import LoaderHOC from "./LoaderHOC";
import { SyncOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Tab } from "semantic-ui-react";
import { Col, Row, Collapse, Modal } from "antd";
import { getBarcode, deleteBarcode } from "../actions/getBarcode-action";
import putData from "../actions/putAactions/putData-action";
import { fetchData } from "../actions/getData-action";
import { Link, Redirect } from "react-router-dom";
import { fetchRefList } from "../actions/getAttributes-action";
import DocButtons from "../components/DocButtons";
import { fetchPrices } from "../actions/getPrices-action";
import updateChanged from "../actions/updateChanged-action";
import buttonsNames from "../ButtonsNames/NotDocs/NotDocsDifferent/buttonsNames";
import { getGroups } from "../actions/getGroups-action";
import {
  openProductGroupModal,
  updateStatesCreate,
} from "../actions/updateStates-action";
import { saveButton } from "../actions/putAactions/saveDocument";
import PercentShow from "./PercentShow";
import { productModalFilter } from "../actions/modalActions/getCustomerGroupsModal-action";
import { getProductsGroupModal } from "../actions/modalActions/getCustomerGroupsModal-action";
import { API_BASE } from "../config/env";
import { updateUpperheader } from "../actions/getNavbar-action";
import axios from "axios";
import ok from "../audio/ok.mp3";
import Trans from "../usetranslation/Trans";
import MobileDrawer from "./MobileDrawer";
import { changeForm } from "../actions/updateStates-action";
import { fetchPage } from "../actions/getData-action";
import { docFilter } from "../config/filter";
import DynamicFieldSet from "./PriceTypes";
import BootstrapTable from "react-bootstrap-table-next";
import { List } from "semantic-ui-react";
import "./Form.css";
import "./Colors.css";
import "./ButtonsWrapper.css";
import {
  PrinterOutlined,
  PlusOutlined,
  DeleteOutlined,
  StopOutlined,
  DownSquareOutlined,
  EditOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Dropdown,
  message,
  Card,
  Select,
  Spin,
  Space,
  Alert,
  Menu,
} from "antd";
import { getToken } from "../config/token";
import { FaThList } from "react-icons/fa";
import changed from "../reducers/changed";
import { updateProductId } from "../actions/updateProduct";
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
var initialValuesDefault = {};
var customCascader = [];
var newArr = [];
var ownersOptions = [];
var depOptions = [];
var errorFieldsDynamic = [];
var lowerCaseForAttributesSelect = [];
var editProduct;
var pid;
var suffixed;
var lowercasearr;
var modSelectObj = {};
const audio = new Audio(ok);

function convert(array) {
  var map = {};
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    if (!(obj.id in map)) {
      map[obj.id] = obj;
      map[obj.id].children = [];
    }

    if (typeof map[obj.id].name == "undefined") {
      map[obj.id].id = obj.id;
      map[obj.id].name = obj.name;
      map[obj.id].parent = obj.parent;
      map[obj.id].value = obj.value;
      map[obj.id].label = obj.label;
    }

    var parent = obj.parent || "-";
    if (!(parent in map)) {
      map[parent] = {};
      map[parent].children = [];
    }

    map[parent].children.push(map[obj.id]);
  }
  return map["-"];
}

function CalcPercent(percent) {
  return percent;
}

var panes;
var oneRefArray = [];
class CreateProductForm extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    initialValuesDefault = {};
    this.state = {
      productid: this.props.selectedProduct
        ? this.props.selectedProduct.Id
        : "",
      weight: false,
      archieve: this.props.selectedProduct
        ? this.props.selectedProduct.IsArch === 1
          ? true
          : false
        : false,
      isArchFunc: false,
      barcodeClicked: false,
      visibleMenuSettings: false,
      defaultpercent: 0,
      barcode: "",
      redirect: false,
      ownername: "",
      archForm: false,
      priceTypeModal: false,
      status: false,
      departmentname: "",
      loadingButton: false,
      lowercase: [],
      loadRoleSelects: true,
      childrenDrawer: false,
      errorFields: [],
      newProductId: "",
      newGroupId: "",
      newGroupName: "",
      newProductId: "",
      newPriceId: "",
      editPriceType: [],
      errorStateMessages: [],
      loadingPrices: false,
      loadingTab: true,
      isPacket: this.props.selectedProduct
        ? this.props.selectedProduct.IsPack
        : 0,
      changedvalues: [],
      sendProObject: {},
      attrRequired: false,
      oneRefList: [],
      focusedModSelect: false,
      sendRequest: false,
    };
  }
  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };
  componentDidMount() {
    initialValuesDefault = {};
    const obj = Object.assign(initialValuesDefault, {});
    this.setState({
      sendProObject: {},
    });
    // this.props.updateProductId(false);
    this.props.saveButton(false);
    this.props.updateUpperheader(this.props.state.navbar.activeSubItem, "");
    this.props.fetchPrices();

    if (!this.props.selectedProduct) {
      this.onGetBarcode();
    }
  }

  onFinishDynamic = (values) => {
    var newPriceTypes = {};
    newPriceTypes = values;
    newPriceTypes.name = values.namepr;
    newPriceTypes.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    this.progressPrice(true);
    this.setState({
      loadingButton: true,
    });
    this.putPriceTypes(newPriceTypes).then((res) => {
      this.progressPrice(
        false,
        res.data.Body.ResponseStatus,
        res.data.Body,
        "save"
      );
    });
  };
  openAddPriceModal = () => {
    this.setState({
      priceTypeModal: true,
    });
  };

  getProductsGroups = () => {
    this.props.getGroups("productfolders");
  };

  deletePriceTypes = (id, e) => {
    e.stopPropagation();
    this.progressPrice(true);
    var grFilter = {};
    grFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    this.delPriceType(id, grFilter).then((res) =>
      this.progressPrice(
        false,
        res.data.Body.ResponseStatus,
        res.data.Body,
        "del"
      )
    );
  };

  editPriceTypes = (id, name, e) => {
    this.setState(
      {
        editPriceType: [
          {
            PriceType: id,
            Name: name,
          },
        ],
      },
      () => this.openAddPriceModal()
    );
  };
  async putPriceTypes(object) {
    const res = await axios.post(`${API_BASE}/pricetypes/put.php`, object);
    return await res;
  }
  async delPriceType(id, object) {
    const res = await axios.post(
      `${API_BASE}/pricetypes/del.php?id=${id}`,
      object
    );
    return await res;
  }

  handleCancel = () => {
    this.setState({
      loadingButton: false,
      priceTypeModal: false,
      editPriceType: [],
    });
  };

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.state.barcode.barcode) {
      if (this.state.barcode !== nextProps.state.barcode.barcode) {
        var newBarcode = nextProps.state.barcode.barcode;
        this.setState({
          barcode: newBarcode,
        });
        this.formRef.current.setFieldsValue({
          barcode: newBarcode,
        });
      }
    }

    if (this.props.state.percent.price !== nextProps.state.percent.price) {
      var newPrice = nextProps.state.percent.price;
      this.formRef.current.setFieldsValue({
        price: newPrice,
      });
    }

    if (
      nextProps.selectedProduct &&
      nextProps.selectedProduct.Id !== this.state.productid
    ) {
      this.setState({
        productid: nextProps.selectedProduct.Id,
        archieve: nextProps.selectedProduct.IsArch == 1 ? true : false,
      });
    }

    if (nextState.newPriceId != this.state.newPriceId) {
      this.setState({
        loadingPrices: true,
      });
    }
  }
  handleTabChange = (event, data) => {
    if (data.activeIndex === 1) {
      modSelectObj = {};
      var mods = {};
      if (this.props.selectedProduct) {
        Object.entries(this.props.selectedProduct).forEach(([key, value]) => {
          if (key.includes("col_")) {
            Object.assign(mods, { [key]: value });
          }
        });
        Object.entries(this.props.state.attributes.reflist).forEach(
          ([key, value]) => {
            Object.entries(value).forEach(([id, name]) => {
              Object.entries(mods).forEach(([keyMods, valueMods]) => {
                if (name.Id === valueMods) {
                  Object.assign(modSelectObj, { [keyMods]: name.Name });
                }
              });
            });
          }
        );
      }

      console.log(modSelectObj);

      setTimeout(() => {
        this.setState({
          loadingTab: false,
        });
        if (this.props.selectedProduct) {
          Object.keys(this.formRef.current.getFieldsValue()).forEach((c) => {
            Object.entries(modSelectObj).forEach(([key, value]) => {
              if (key === c) {
                this.formRef.current.setFieldsValue({
                  [c]: value,
                });
              }
            });
          });
        }
      }, 1000);
    } else if (data.activeIndex === 0) {
      this.props.fetchPrices();
    } else {
      this.setState({
        loadingTab: true,
      });
    }
  };
  onValuesChange = (changedValues, allValues) => {
    console.log(changedValues);

    // this.props.updateChanged('true', 'p=products')
  };

  progressGr = (fetching, name, status, mess, from) => {
    console.log("progressgr isledi");

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
          newGroupId: mess.ResponseService,
          newGroupName: name,
        });
        this.onChildrenDrawerClose();
        if (from === "save") {
          message.success("Saxlanıldı");
          this.formRef.current.setFieldsValue({
            groupid: this.state.newGroupName,
          });
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
          editGroupId: mess.responseService,
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
        });
      }
    }
  };
  progressPrice = (fetching, status, mess, from) => {
    if (fetching) {
      message.loading("Yüklənir...");
    } else if (fetching === "error") {
      console.log("errora girdi");
      message.destroy();
      if (from === "save") {
        message.error(`Saxlanılmadı.. ${mess}`);
        this.setState({
          loadingButton: false,
        });
      } else if (from === "del") {
        message.error(`Silinmədi.. ${mess}`);
        this.setState({
          loadingButton: false,
        });
      }
    } else {
      message.destroy();
      if (status === "0") {
        this.setState({
          newPriceId: mess.ResponseService,
        });

        if (from === "save") {
          message.success("Saxlanıldı");
          this.setState(
            {
              loadingButton: false,
              priceTypeModal: false,
            },
            () => this.props.fetchPrices()
          );
        } else if (from === "del") {
          message.success("Silindi");
          this.props.fetchPrices();
        }

        this.setState({
          editId: mess.responseService,
        });
      } else {
        if (from === "save") {
          message.error(`Saxlanılmadı.. ${mess}`);
          this.setState({
            loadingButton: false,
          });
        } else if (from === "del") {
          message.error(`Silinmədi.. ${mess}`);
          this.setState({
            loadingButton: false,
          });
        }
      }
    }
  };
  progress = (fetching, status, mess, arch, from) => {
    console.log(fetching);
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
            audio.play();

            return message.success("Arxivə salındı");
          } else if (arch === "archievegancel") {
            audio.play();
            return message.success("Arxivdən çıxarıldı");
          }
          return;
        } else if (from === "save") {
          message.success("Saxlanıldı");
          audio.play();

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
          audio.play();
          this.props.updateProductId(false);

          this.setState({
            status: true,
          });
        }

        this.props.updateProductId(true);
        this.setState({
          editId: mess.responseService,
          loadingButton: false,
          sendRequest: false,
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

  async delProduct(id, object) {
    const res = await axios.post(
      `${API_BASE}/products/del.php?id=${id}`,
      object
    );
    return await res;
  }

  async putProduct(object) {
    const res = await axios.post(`${API_BASE}/products/put.php`, object);
    return await res;
  }

  async putProductGr(object) {
    const res = await axios.post(`${API_BASE}/productfolders/put.php`, object);
    return await res;
  }

  handleArchieve = (bool) => {
    this.setState({
      archieve: bool,
      archForm: true,
      isArchFunc: true,
    });
  };

  onFinishGrModal = (values) => {
    this.progressGr(true);
    this.setState({
      loadingButton: true,
    });
    var sendProductGr = {};
    sendProductGr = values;
    sendProductGr.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    this.putProductGr(sendProductGr).then((res) =>
      this.progressGr(
        false,
        values.name,
        res.data.Body.ResponseStatus,
        res.data.Body,
        "save"
      )
    );
  };

  onFinish = (values) => {
    var reqErrors = [];
    var reqattr = false;
    errorFieldsDynamic = [];
    this.props.changeForm(false);

    this.progress(true);

    var sendProduct = {};
    sendProduct = values;
    console.log("values", values);
    sendProduct.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    var prices = [];
    Object.entries(sendProduct).map(([k, v]) => {
      if (k.indexOf("PriceType_") != -1) {
        if (v) {
          prices.push({
            PriceType: k.slice(k.indexOf("_") + 1),
            Price: v,
          });
        }
      }
    });
    sendProduct.prices = prices;
    var totalFilter = {
      ...initialValuesDefault,
      ...sendProduct,
      ...this.state.sendProObject,
    };
    console.log("totalFiltercolde", totalFilter);
    Object.values(this.props.attrInputs).map((atr) => {
      if (atr.isrequired === 1) {
        if (
          Object.entries(totalFilter).findIndex(([k, v]) => k === atr.name) ===
            -1 ||
          !Object.entries(totalFilter).find(([k, v]) => k === atr.name)[1]
        ) {
          console.log("totalFilter", totalFilter);
          reqattr = true;
          reqErrors.push(atr.label);
        }
      }
    });
    if (this.state.archieve) {
      totalFilter.isarch = true;
    } else if (!this.state.archieve) {
      totalFilter.isarch = false;
    } else {
      totalFilter.isarch =
        this.props.selectedProduct.IsArch === 1 ? true : false;
    }
    if (totalFilter.isweight === 0 && !this.state.weight) {
      totalFilter.isweight = false;
    } else if (totalFilter.isweight === 1 && !this.state.weight) {
      totalFilter.isweight = true;
    } else if (totalFilter.isweight === 0 && this.state.weight) {
      totalFilter.isweight = true;
    } else {
      totalFilter.isweight = this.state.weight;
    }
    console.log("values", totalFilter);

    if (reqErrors.length === 0) {
      if (!this.state.sendRequest) {
        this.putProduct(totalFilter).then((res) => {
          docFilter.id = res.data.Body.ResponseService;
          this.props.fetchPage("products");
          this.progress(
            false,
            res.data.Body.ResponseStatus,
            res.data.Body,
            this.state.archieve ? "archieve" : "archievegancel",
            "save"
          );
        });
      }
      this.setState({ sendRequest: true });
    } else {
      this.progress(
        false,
        1,
        "Parametrlər bölməsində vacib xanaları doldurun",
        this.state.archieve ? "archieve" : "archievegancel",
        "save"
      );
      this.setState({
        loadingButton: false,
        sendRequest: false,
      });
    }
    // sendProduct = values;

    // this.setState({
    //   loadingButton: true,
    // });
    // this.state.isPacket === 1
    //   ? (sendProduct.ispack = 1)
    //   : (sendProduct.ispack = 0);
    // this.state.newProductId != ""
    //   ? (sendProduct.id = this.state.newProductId)
    //   : (sendProduct.id = values.id);

    // delete sendProduct["weight"];

    // if (this.state.newGroupId != "") {
    //   delete sendProduct["groupid"];
    //   sendProduct.groupid = this.state.newGroupId;
    // }

    // var totalFilter = Object.assign(
    //   sendProduct,
    //   initialValuesDefault,
    //   this.state.sendProObject
    // );
    // totalFilter = Object.assign(sendProduct, this.state.sendProObject);

    // sendProduct.isweight = initialValuesDefault
    //   ? initialValuesDefault.isweight
    //   : this.state.weight;

    // reqErrors.forEach((error) => {
    //   errorFieldsDynamic.push(`Zəhmət olmassa, ${error} xanasını doldurun`);
    // });
    // this.setState({
    //   errorStateMessages: errorFieldsDynamic,ish
    // });
  };

  onChangeItem = (e, name) => {
    var changedvalue = { [name]: e.target.value };
    this.setState({
      sendProObject: Object.assign(this.state.sendProObject, changedvalue),
      status: false,
      isArchFunc: false,
    });
    this.props.updateChanged("true", "p=products");
    this.props.changeForm(true);
  };
  onChangeSelectItem = (e, name) => {
    var changedvalue = { [name]: e };
    this.setState({
      sendProObject: Object.assign(this.state.sendProObject, changedvalue),
      status: false,
      isArchFunc: false,
    });
    this.props.updateChanged("true", "p=products");
    this.props.changeForm(true);
  };

  onFinishFailed = (values) => {
    this.props.saveButton(false);

    this.setState({
      errorFields: values.errorFields,
      errorStateMessages: [],
    });
  };
  onGetBarcode = () => {
    this.props.getBarcode(this.state.weight);
    this.props.updateChanged("true", "p=products");
  };
  handleBarcodeSelect = (event) => {
    this.props.changeForm(true);

    this.setState(
      {
        weight: event.target.checked,
      },
      () => this.onGetBarcode()
    );
  };

  handleSetPacket = (event) => {
    this.props.changeForm(true);
    var ispack = event.target.checked ? 1 : 0;
    this.setState({
      isPacket: ispack,
    });
  };
  deleteProduct = (id, e) => {
    e.stopPropagation();
    this.progress(true);
    var grFilter = {};
    grFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    this.delProduct(id, grFilter)
      .then((res) =>
        this.progress(
          false,
          res.data.Body.ResponseStatus,
          res.data.Body,
          this.state.archieve ? "archieve" : "archievegancel",
          "del"
        )
      )
      .then(() => this.setState({ redirect: true }));
  };

  async getOneRefList(object) {
    const res = await axios.post(
      `${API_BASE}/attributes/getreflist.php`,
      object
    );
    return await res;
  }
  getRefList = (e) => {
    window.scrollTo(0, 0);
    oneRefArray = [];
    this.setState({
      oneRefList: [],
      focusedModSelect: true,
    });
    var getOneFilter = {};
    getOneFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    getOneFilter.refid = e.target.id;
    this.getOneRefList(getOneFilter)
      .then((res) => {
        if (Array.isArray(res.data.Body.List)) {
          res.data.Body.List.map((r) => {
            oneRefArray.push({
              label: r.Name,
              value: r.Id,
            });
          });
        } else {
          oneRefArray.push({
            label: "Bağlılıq yoxdur",
            value: Math.random(),
          });
        }
      })
      .then(() => {
        this.setState({
          oneRefList: oneRefArray,
        });
      });
  };
  clearRefList = () => {
    this.setState({
      oneRefList: [],
      focusedModSelect: false,
    });
  };
  handleFocus = (event) => {
    event.target.select();
  };
  handleVisibleChange = (flag) => {
    this.setState({ visibleMenuSettings: flag });
  };

  render() {
    if (this.state.redirect == true) {
      return <Redirect push to="/p=product" />;
    }
    depOptions = [];
    ownersOptions = [];
    newArr = [];
    customCascader = [];
    lowerCaseForAttributesSelect = [];
    Object.values(this.props.state.attributes.reflist).map((r) => {
      lowerCaseForAttributesSelect.push({
        label: r.Name,
        value: r.Id,
      });
    });
    Object.values(this.props.owners).map((r) => {
      ownersOptions.push({
        label: r.Name,
        value: r.Id,
      });
    });
    Object.values(this.props.departments).map((r) => {
      depOptions.push({
        label: r.Name,
        value: r.Id,
      });
    });
    Object.values(this.props.state.groups.groups).map((d) => {
      d.ParentId === "00000000-0000-0000-0000-000000000000"
        ? (pid = "")
        : (pid = d.ParentId);
      customCascader.push({
        id: d.Id,
        name: d.Name,
        parent: pid,
        value: d.Id,
        label: d.Name,
      });
    });
    newArr = convert(customCascader);
    console.log("attrinputs", this.props.attrInputs);
    const modInputs = this.props.attrInputs
      .filter((a) => a.referencetypeid === "")
      .map((a) => (
        <Form.Item
          label={a.label}
          onBlur={(e) => this.onChangeItem(e, `${a.name}`)}
          name={a.name}
          key={a.id}
          rules={[
            {
              required: a.isrequired == 1 ? true : false,
              message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
            },
          ]}
        >
          <Input allowClear={true} />
        </Form.Item>
      ));
    const modSelects = this.props.attrInputs
      .filter((a) => a.referencetypeid != "")
      .map((a) => (
        <Form.Item
          label={a.label}
          name={a.name}
          key={a.id}
          rules={[
            {
              required: a.isrequired == 1 ? true : false,
              message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
            },
          ]}
        >
          <Select
            showSearch
            allowClear={true}
            style={{ width: 200 }}
            id={a.referencetypeid}
            placeholder=""
            onChange={(e) => this.onChangeSelectItem(e, `${a.name}`)}
            onFocus={this.getRefList}
            onBlur={this.clearRefList}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            notFoundContent={<Spin size="small" />}
            loading={this.props.state.attributes.refLoading}
            options={
              this.props.state.attributes.refLoading === false &&
              !this.state.focusedModSelect
                ? lowerCaseForAttributesSelect
                : this.state.focusedModSelect
                ? this.state.oneRefList
                : ""
            }
          ></Select>
        </Form.Item>
      ));

    panes = [
      {
        menuItem: "Qiymət",
        render: () => (
          <Tab.Pane className="numberinputsholder" attached={false}>
            <Form.Item
              onBlur={(e) => this.onChangeItem(e, "buyprice")}
              label={<Trans word={"BuyPrice"} />}
              name="buyprice"
            >
              <Input
                type="number"
                step="any"
                className="hiddenarrows"
                onFocus={this.handleFocus}
                addonAfter="₼"
                min={0}
              />
            </Form.Item>

            <Form.Item
              onBlur={(e) => this.onChangeItem(e, "costprice")}
              label={<Trans word={"Cost Price"} />}
              name="costprice"
              hidden={this.state.productid != "" ? false : true}
            >
              <Input
                type="number"
                step="any"
                className="hiddenarrows"
                onFocus={this.handleFocus}
                disabled={true}
                addonAfter="₼"
                min={0}
              />
            </Form.Item>

            <h5>Satış qiymətləri</h5>
            <Form.Item
              onBlur={(e) => this.onChangeItem(e, "price")}
              label={<Trans word={"Product Price"} />}
              name="price"
            >
              <Input
                type="number"
                step="any"
                className="hiddenarrows"
                onFocus={this.handleFocus}
                addonAfter="₼"
                min={0}
              />
            </Form.Item>
            <Form.Item
              onBlur={(e) => this.onChangeItem(e, "minprice")}
              label={<Trans word={"MinPrice"} />}
              name="minprice"
            >
              <Input
                type="number"
                step="any"
                className="hiddenarrows"
                onFocus={this.handleFocus}
                addonAfter="₼"
                min={0}
              />
            </Form.Item>

            {/* dynamic form starts */}
            <div className="prices_wrapper">
              <Spin
                className="price_wrapper_spinner"
                spinning={this.props.state.prices.loading}
              >
                {this.props.state.prices.prices.map((c) => (
                  <div className="price_del_icons">
                    <Form.Item
                      onBlur={(e) => this.onChangeItem(e, `PriceType_${c.Id}`)}
                      label={c.Name}
                      name={"PriceType_" + c.Id}
                    >
                      <Input
                        type="number"
                        step="any"
                        className="hiddenarrows"
                        onFocus={this.handleFocus}
                        addonAfter="₼"
                        min={0}
                      />
                    </Form.Item>
                    <div className="icons_wrapper price_delete_button">
                      <MinusCircleOutlined
                        className="dynamic-delete-button "
                        onClick={(e) => this.deletePriceTypes(c.Id, e)}
                      />
                      <EditOutlined
                        className="dynamic-delete-button"
                        onClick={(e) => this.editPriceTypes(c.Id, c.Name, e)}
                      />
                    </div>
                  </div>
                ))}
              </Spin>
            </div>
            <Button
              type="dashed"
              className={"create_new_price_button"}
              onClick={this.openAddPriceModal}
              block
              icon={<PlusOutlined />}
            >
              Yeni qiymət
            </Button>
            <Modal
              destroyOnClose
              className="modal_price_type"
              title="Ad"
              visible={this.state.priceTypeModal}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  Bağla
                </Button>,
                <Button
                  key="submit"
                  htmlType={"submit"}
                  loading={this.state.loadingButton}
                  className="customsavebtn"
                  form="priceTypes"
                >
                  Yadda saxla
                </Button>,
              ]}
            >
              <Form
                id="priceTypes"
                name="dynamic_form_nest_item"
                onFinish={this.onFinishDynamic}
                autoComplete="off"
                initialValues={{
                  namepr: this.state.editPriceType[0]
                    ? this.state.editPriceType[0].Name
                    : "",
                  id: this.state.editPriceType[0]
                    ? this.state.editPriceType[0].PriceType
                    : "",
                }}
              >
                <Form.Item
                  onBlur={(e) => this.onChangeItem(e, "namepr")}
                  name="namepr"
                >
                  <Input placeholder={"adı"} />
                </Form.Item>

                <Form.Item
                  onBlur={(e) => this.onChangeItem(e, "id")}
                  name="id"
                  hidden={true}
                >
                  <Input placeholder={"adı"} />
                </Form.Item>
              </Form>
            </Modal>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Parametrlər",
        render: () => (
          <Tab.Pane loading={this.state.loadingTab} attached={false}>
            {modInputs}
            {modSelects}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Anbar qalığı",
        render: () => <Tab.Pane attached={false}></Tab.Pane>,
      },
      {
        menuItem: "Tarix",
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
      },
    ];
    const menu = (
      <Menu>
        <Menu.Item key="0">
          {this.state.archieve ? (
            <Button
              icon={<DownSquareOutlined />}
              htmlType="submit"
              form="myForm"
              onClick={() => this.handleArchieve(false)}
              className="align_center arch"
              disabled={
                this.state.productid === ""
                  ? this.state.newProductId === ""
                    ? true
                    : false
                  : false
              }
            >
              Arxivdən çıxart
            </Button>
          ) : (
            <Button
              icon={<DownSquareOutlined />}
              htmlType="submit"
              form="myForm"
              onClick={() => this.handleArchieve(true)}
              className="align_center arch"
              disabled={
                this.state.productid === ""
                  ? this.state.newProductId === ""
                    ? true
                    : false
                  : false
              }
            >
              Arxivə sal
            </Button>
          )}
        </Menu.Item>
        <Menu.Item key="1">
          <Button
            icon={<DeleteOutlined />}
            onClick={(e) =>
              this.deleteProduct(
                this.state.productid != ""
                  ? this.state.productid
                  : this.state.newProductId === ""
                  ? ""
                  : this.state.newProductId,
                e
              )
            }
            className="align_center del"
            disabled={
              this.state.productid === ""
                ? this.state.newProductId === ""
                  ? true
                  : false
                : false
            }
          >
            Məhsulu silin
          </Button>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );

    var errorKeys = 0;
    const errorMessages = (
      <List as="ul">
        {Array.isArray(this.state.errorStateMessages)
          ? this.state.errorStateMessages.map((m) => (
              <List.Item key={errorKeys++} as="li">
                {m}
              </List.Item>
            ))
          : ""}
      </List>
    );
    initialValuesDefault = this.props.selectedProduct
      ? Object.assign(
          ...Object.keys(this.props.selectedProduct).map((key) => ({
            [key.toLowerCase()]: this.props.selectedProduct[key],
          }))
        )
      : "";
    var prices = {};

    if (this.props.selectedProduct) {
      if (Array.isArray(this.props.selectedProduct.Prices)) {
        this.props.selectedProduct.Prices.map((p) => {
          var name = "PriceType_" + p.PriceType;
          prices[name] = p ? p.Price : "";
        });
      }
    }
    const obj = Object.assign(initialValuesDefault, prices);
    console.log("initialValuesDefault", initialValuesDefault);
    const { errorFields } = this.state;

    const check = (
      <Menu>
        <Menu.Item key="0">
          <Button className="print_barcode mobilehidden">
            <Link
              to={{
                pathname: "/bc/",
                search: `${
                  this.state.productid != ""
                    ? "bc=" +
                      this.props.state.datas.doc[0].BarCode +
                      "&pr=" +
                      this.props.state.datas.doc[0].Price +
                      "&nm=" +
                      this.props.state.datas.doc[0].Name
                    : ""
                }`,
                hash: "demands",
              }}
              target={"_blank"}
            >
              Ədəd
            </Link>
          </Button>
        </Menu.Item>

        <Menu.Item key="1">
          <Button
            disabled={
              this.props.selectedProduct ?this.props.state.datas.doc[0].IsPack ===
              0
                ? true
                : false
                :true
            }
            className="print_barcode mobilehidden"
          >
            <Link
              to={{
                pathname: "/bc/",
                search: `${
                  this.state.productid != ""
                    ? "bc=" +
                      this.props.state.datas.doc[0].BarCode +
                      "&pr=" +
                      this.props.state.datas.doc[0].PackPrice +
                      "&nm=" +
                      this.props.state.datas.doc[0].Name
                    : ""
                }`,
                hash: "demands",
              }}
              target={"_blank"}
            >
              Paket
            </Link>
          </Button>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="table_holder">
        <MobileDrawer
          docbuttons={
            <DocButtons
              fetchPro={this.state.loadingButton}
              errorFields={errorFields}
              from="p=product"
              fromDoc="createDemand"
              toDoc="createPaymentOut"
              buttonsName={buttonsNames}
              activeitem={this.props.state.navbar.activeItem}
              activesubitem={this.props.state.navbar.activeSubItem}
            />
          }
          printbuttons={
            <Button className="print_barcode">
              <Link
                to={{
                  pathname: "/bc/",
                  search: `${
                    this.state.productid != ""
                      ? "bc=" +
                        this.props.state.datas.doc[0].BarCode +
                        "&pr=" +
                        this.props.state.datas.doc[0].Price +
                        "&nm=" +
                        this.props.state.datas.doc[0].Name
                      : ""
                  }`,
                  hash: "demands",
                }}
                target={"_blank"}
              >
                <PrinterOutlined />
              </Link>
            </Button>
          }
        />

        <Modal
          title={<Trans word={"Group Name"} />}
          visible={this.state.childrenDrawer}
          onCancel={this.onChildrenDrawerClose}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={this.onChildrenDrawerClose}>
              Bağla
            </Button>,
            <Button
              loading={this.state.loadingButton}
              key="submit"
              htmlType="submit"
              form="docModalGroup"
              type="primary"
            >
              Yadda Saxla
            </Button>,
          ]}
        >
          <Form
            className="docModal"
            id="docModalGroup"
            ref={this.formRef}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            name="basic"
            initialValues={{}}
            layout="horizontal"
            onFinish={this.onFinishGrModal}
          >
            <Row className="main_form_side">
              <Col xs={24} md={9} xl={24} className="left_form_wrapper">
                <Form.Item
                  onBlur={(e) => this.onChangeItem(e, "name")}
                  label={<Trans word={"Group Name"} />}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                    },
                  ]}
                >
                  <Input allowClear={true} />
                </Form.Item>

                <Form.Item
                  label={<Trans word={"Product GroupName"} />}
                  name="parentid"
                >
                  <TreeSelect
                    allowClear={true}
                    onBlur={(e) => this.onChangeItem(e, "parentid")}
                    onFocus={this.getProductsGroups}
                    treeData={newArr ? newArr.children : []}
                  />
                </Form.Item>
                <Form.Item
                  label={<Trans word={"Description"} />}
                  name="description"
                  onBlur={(e) => this.onChangeItem(e, "description")}
                >
                  <TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Row>
          <Col className="page_name_wrapper" xs={24} md={24} xl={24}>
            <h2 className="custom_top_margin">
              <Trans word={"Products"} />
            </h2>
          </Col>
          <Col xs={24} md={24} xl={24} className="form_header_wrapper">
            <DocButtons
              fetchPro={this.state.loadingButton}
              errorFields={errorFields}
              from="p=product"
              fromDoc="createDemand"
              toDoc="createPaymentOut"
              buttonsName={buttonsNames}
              activeitem={this.props.state.navbar.activeItem}
              activesubitem={this.props.state.navbar.activeSubItem}
            />
            <div className="form_header_right_buttons_wrapper">
              <Dropdown overlay={check} trigger={["click"]}>
                <Button className="flex_directon_col_center d-flex-row">
                  <PrinterOutlined /> Barkod
                </Button>
              </Dropdown>

              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  className={
                    this.props.state.stateChanges.openCreateModal
                      ? "d-none"
                      : "form_setting_icon_wrapper flex_directon_col_center"
                  }
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="dots"></span>
                  <span className="dots"></span>
                  <span className="dots"></span>
                </Button>
              </Dropdown>
            </div>
          </Col>
          <Col xs={24} md={24} xl={24}>
            {console.log("this.props.updated", this.props.updated)}
            <Form
              id="myForm"
              ref={this.formRef}
              style={{ padding: "0px 20px" }}
              name="basic"
              className=""
              initialValues={
                this.props.selectedProduct ? initialValuesDefault : ""
              }
              layout="horizontal"
              onFinish={this.onFinish}
              onValuesChange={this.onValuesChange}
              onFinishFailed={this.onFinishFailed}
            >
              <Row className="main_form_side">
                <Col
                  xs={24}
                  md={9}
                  xl={8}
                  className="left_form_wrapper"
                  style={{ padding: "10px 20px" }}
                >
                  <Alert
                    message={errorMessages}
                    type="error"
                    style={{
                      marginBottom: "15px",
                      display:
                        this.state.errorStateMessages.length > 0
                          ? "block"
                          : "none",
                    }}
                    showIcon
                  />
                  <div
                    className="ant-row ant-form-item"
                    style={{ marginBottom: "2.5rem" }}
                  >
                    <div className="ant-col ant-col-7 ant-form-item-label">
                      <h2>Ümumi məlumatlar</h2>
                    </div>
                    <div className="ant-col ant-col-12 ant-form-item-label">
                      <h2></h2>
                    </div>
                  </div>

                  <Form.Item
                    label={<Trans word={"Product Name"} />}
                    name="name"
                    onBlur={(e) => this.onChangeItem(e, "name")}
                    rules={[
                      {
                        required: true,
                        message: "Zəhmət olmasa, məhsulun adını qeyd edin..",
                      },
                    ]}
                  >
                    <Input allowClear={true} />
                  </Form.Item>

                  <Form.Item
                    label={<Trans word={"BarCode"} />}
                    name="barcode"
                    onBlur={(e) => this.onChangeItem(e, "barcode")}
                    allowClear={true}
                  >
                    <Input
                      suffix={
                        <SyncOutlined
                          className={"suffixed"}
                          onClick={this.onGetBarcode}
                        />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    hidden={true}
                    label="id"
                    onBlur={(e) => this.onChangeItem(e, "id")}
                    name="id"
                  >
                    <Input />
                  </Form.Item>

                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label={<Trans word={"Product GroupName"} />}
                      name="groupid"
                      className="group_item_wrapper"
                      style={{ width: "100%" }}
                      rules={[
                        {
                          required: true,
                          message:
                            "Zəhmət olmasa, məhsulun qrupunu qeyd edin..",
                        },
                      ]}
                    >
                      <TreeSelect
                        allowClear={true}
                        onChange={(e) => this.onChangeSelectItem(e, "groupid")}
                        onFocus={this.getProductsGroups}
                        treeData={newArr ? newArr.children : []}
                      />
                    </Form.Item>
                    <PlusOutlined
                      className="custom_add_group_icon addGroupFromProducts"
                      onClick={this.showChildrenDrawer}
                    />
                  </div>

                  <Form.Item
                    label={<Trans word={"ArtCode"} />}
                    name="artcode"
                    onBlur={(e) => this.onChangeItem(e, "artcode")}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label={<Trans word={"Description"} />}
                    onBlur={(e) => this.onChangeItem(e, "description")}
                  >
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item
                    label={<Trans word={"Weight"} />}
                    name="isweight"
                    valuePropName="checked"
                    onBlur={(e) => this.onChangeItem(e, "isweight")}
                  >
                    <Checkbox
                      onChange={this.handleBarcodeSelect}
                      disabled={this.props.selectedProduct ? true : false}
                      name="wt"
                    ></Checkbox>
                  </Form.Item>

                  <Collapse ghost>
                    <Panel header="Əlavə parametr" key="1">
                      <Collapse>
                        <Panel header="Paket (qutu)" key="1">
                          <Form.Item
                            label={"Paketli məhsul"}
                            valuePropName="checked"
                            name={"ispack"}
                          >
                            <Checkbox
                              onChange={this.handleSetPacket}
                            ></Checkbox>
                          </Form.Item>
                          <Form.Item
                            label="Satış qiyməti"
                            name="packprice"
                            onBlur={(e) => this.onChangeItem(e, "packprice")}
                          >
                            <InputNumber
                              disabled={
                                this.state.isPacket === 1 ? false : true
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            label="Ədəd"
                            name="packquantity"
                            onBlur={(e) => this.onChangeItem(e, "packquantity")}
                          >
                            <InputNumber
                              disabled={
                                this.state.isPacket === 1 ? false : true
                              }
                            />
                          </Form.Item>
                        </Panel>
                      </Collapse>
                    </Panel>
                  </Collapse>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <div className="tab_wrapper">
                    <Tab
                      menu={{ attached: false }}
                      onTabChange={this.handleTabChange}
                      forceRender
                      panes={panes}
                    />
                  </div>
                </Col>
                <Col xs={24} md={24} xl={8}>
                  <Collapse ghost>
                    <Panel header="Təyinat" key="1">
                      <Form.Item
                        label={"Cavabdeh"}
                        name="ownerid"
                        style={{ margin: "0" }}
                      >
                        <Select
                          showSearch
                          onChange={(e) =>
                            this.onChangeSelectItem(e, "ownerid")
                          }
                          placeholder=""
                          filterOption={false}
                          notFoundContent={<Spin size="small" />}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          loading={
                            this.props.state.groups.loading ? (
                              <Spin size="small" />
                            ) : (
                              ""
                            )
                          }
                          options={ownersOptions}
                        />
                      </Form.Item>
                      <Form.Item
                        label={"Şöbə"}
                        name="departmentid"
                        style={{ margin: "0" }}
                      >
                        <Select
                          showSearch
                          placeholder=""
                          onChange={(e) =>
                            this.onChangeSelectItem(e, "departmentid")
                          }
                          notFoundContent={<Spin size="small" />}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          loading={
                            this.props.state.groups.loading ? (
                              <Spin size="small" />
                            ) : (
                              ""
                            )
                          }
                          options={depOptions}
                        />
                      </Form.Item>
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  getBarcode,
  saveButton,
  putData,
  fetchData,
  fetchRefList,
  updateChanged,
  deleteBarcode,
  getGroups,
  openProductGroupModal,
  updateStatesCreate,
  fetchPrices,
  updateUpperheader,
  getProductsGroupModal,
  changeForm,
  fetchPage,
  updateProductId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoaderHOC(CreateProductForm, "datas"));
