import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Divider,
  Button,
  Menu,
  Dropdown,
  Popconfirm,
  Form,
  InputNumber,
  Space,
  Typography,
  Spin,
  Switch,
  Checkbox,
  Statistic,
  Select,
  Row,
  Col,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { updateSelectProductMultiConfirm } from "../actions/updateStates-action";
import {
  getCustomerGroupsModal,
  getStocksGroupsModal,
  productModalFilter,
  getProductsModal,
  getProductsGroupModal,
} from "../actions/modalActions/getCustomerGroupsModal-action";
import CreateProductAndProductGroup from "../modal/CreateProductAndProductGroup";
import CreateProductFormModal from "../modal/CreateProductModal";
import { putAddedPoisitons } from "../actions/putAactions/putAddedPoisitons";
import { deleteResponseService } from "../actions/putAactions/deleteResponseService";
import { putLocalStates } from "../actions/modalActions/putModalInputs-action";
import { updateSelectedRows } from "../actions/updateStates-action";
import updateChanged from "../actions/updateChanged-action";
import Demo from "./AddProductInput";
import { updatePositions } from "../actions/updateProduct";
import { fetchAttributes } from "../actions/getAttributes-action";
import { Tab } from "semantic-ui-react";
import OrgChartLinkedDocs from "./OrgChartLinkedDocs";
import { updateUpperheader } from "../actions/getNavbar-action";
import { changeForm } from "../actions/updateStates-action";
import getLinks from "../actions/getLinks-action";
import { clearDoc, putConsumption } from "../actions/putAactions/saveDocument";
import { Empty } from "antd";
import QueueAnim from "rc-queue-anim";
import bc from "../audio/bc.mp3";
import SelectProductCatalog from "../modal/SelectProductCatalog";
import { useMediaQuery } from "react-responsive";
import Trans from "../usetranslation/Trans";
import { Null_Content } from "../config/env";
import { fetchPrices } from "../actions/getPrices-action";
import "./DocTable.css";
import { API_BASE } from "../config/env";
import axios from "axios";
import {
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  PoweroffOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import AddProInput from "./AddProInput";
import { parse } from "query-string";
import CreateProductModal from "../modal/CreateProductModal";
import { filter } from "dom-helpers";
import { replace } from "lodash";
import {
  ConvertFixedTable,
  ConvertFixedPosition,
  FindAdditionals,
  FindCofficient,
} from "../Function/convertNumberDecimal";
import { getToken } from "../config/token";
import AddProInputNew from "./AddProInputNew";
import { PrinterOutlined } from "@ant-design/icons";
const audio = new Audio(bc);

const EditableContext = React.createContext(null);
const { Option } = Select;
const { TextArea } = Input;
export var poistionArray = [];
export var description;
export var consumption;
var inputsNameArray = [];
var sumtotalprices = 0;
var consumtionArray = [];
var consumtionPriceArray = [];
var defaultCostArray = [];

var selectAllPrices = [];

function PositionArray(arr) {
  poistionArray = arr;
}

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

function uniqByKeepFirst(a, key) {
  let seen = new Set();
  return a.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

function AddRepeatProduct(prevdatasource, i, newdata) {
  var quantity = parseFloat(prevdatasource[i].Quantity);
  const item = prevdatasource[i];
  quantity++;
  var totalprice = quantity * parseFloat(prevdatasource[i].SellPrice);
  var totalcostprice = quantity * parseFloat(prevdatasource[i].CostPrice);
  newdata.ShowPacket = false;
  newdata.Quantity = quantity;
  newdata.TotalPrice = totalprice;
  newdata.CostPriceTotal = totalcostprice;
  newdata.Price = prevdatasource[i].SellPrice;
  prevdatasource.splice(i, 1);
  prevdatasource.unshift(newdata);
  audio.play();

  return prevdatasource;
}

var columnsPassed = [];

export const addNewRow = (fromInput) => {
  return fromInput;
};
const EditableCell = ({
  title,
  editable,
  switchable,
  children,
  dataIndex,
  saledoc,
  record,
  handleSave,
  handlePacket,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [defaultNum, setDefaultNum] = useState(0);

  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    setDefaultNum(record[dataIndex]);

    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const handleFocus = (event) => event.target.select();

  const save = async () => {
    try {
      const values = await form.validateFields();
      for (const [key, value] of Object.entries(values)) {
        if (value === null) {
          toggleEdit();
        } else {
          toggleEdit();
          handleSave({ ...record, ...values });
        }
      }
    } catch (errInfo) {}
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <InputNumber
          parser={(value) => value.replace(",", ".")}
          onFocus={handleFocus}
          min={0}
          max={saledoc ? record.DefaultQuantity : ""}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

var switchcase = false;
var linkedArray = [];
var customPositions = [];
var changedPositions = [];
export var arrPosition = [];
var headerColumns = [];

function handleClick(e) {
  e.preventDefault();
  e.stopPropagation();
}

function checkIfDuplicateExists(arr) {
  var valueArr = arr.map(function (item) {
    return item.BarCode;
  });
  var isDuplicate = valueArr.some(function (item, idx) {
    return valueArr.indexOf(item) != idx;
  });

  return isDuplicate;
}

function CalculateConsumption(consumption, sumtotalprices) {
  consumtionArray = [];

  poistionArray.forEach((p) => {
    consumtionArray.push(
      FindAdditionals(consumption, sumtotalprices, p.TotalPrice)
    );
  });
}

class DocTable extends React.Component {
  constructor(props) {
    super(props);
    console.log("this.props.datasource", this.props.datasource);
    customPositions = [];
    this.enterAnim = [
      {
        opacity: 0,
        x: 30,
        backgroundColor: "#fffeee",
        duration: 0,
      },
      {
        height: 0,
        duration: 200,
        type: "from",
        delay: 250,
        ease: "easeOutQuad",
        onComplete: this.onEnd,
      },
      {
        opacity: 1,
        x: 0,
        duration: 250,
        ease: "easeOutQuad",
      },
      { delay: 1000, backgroundColor: "#fff" },
    ];
    this.leaveAnim = [
      { duration: 250, opacity: 0 },
      { height: 0, duration: 200, ease: "easeOutQuad" },
    ];

    if (props.datasource) {
      Object.values(this.props.datasource).map((d) => customPositions.push(d));
    }
    // customposition array add key and totaolprice datas

    customPositions.map((c, index) => (c.key = index));
    customPositions.map((c) => (c.SellPrice = c.Price));
    customPositions.map((c) => (c.BasicPrice ?  c.PrintPrice = c.BasicPrice : ''));
    customPositions.map((c) => (c.DefaultQuantity = c.Quantity));

    customPositions.map(
      (c) => (c.TotalPrice = parseFloat(c.Price) * parseFloat(c.Quantity))
    );

    customPositions.map(
      (c) =>
        (c.CostPriceTotal = parseFloat(c.CostPrice) * parseFloat(c.Quantity))
    );

    props.clearDoc();
    this.state = {
      searchText: "",
      searchedColumn: "",
      selectedRowKeys: [],
      customDatas: customPositions,
      dataSource: customPositions.length > 0 ? customPositions : [],
      addSource: customPositions,
      showpacket: false,
      defaultPacket: "pc",
      showDrawerProduct: false,
      showDrawerProductGroup: false,
      selectedrow: [],
      selectedid: [],
      columns: [],
      playstatus: false,
      initialCols: [],
      visibleMenuSettings: false,
      hasConsumption: this.props.doc
        ? this.props.doc.Consumption
          ? true
          : false
        : false,
      consumptionValue: this.props.doc
        ? this.props.doc.Consumption
          ? this.props.doc.Consumption
          : 0
        : 0,
      docProPriceTypes: [],
      loadingPrices: true,
      loadingTableChangePrice: false,
      matches: window.matchMedia("(min-width: 600px)").matches,
      copyDataSource: false,
    };
    columnsPassed = this.columns;
  }

  handleDes = (e) => {
    description = e.target.value;
    if (this.props.doc && this.props.doc.Description != e.target.value) {
      this.props.changeForm(true);
    }
    if (!e.target.value || e.target.value === "") {
      description = "";
    }
  };

  showDrawer = () => {
    this.setState({
      showDrawerProduct: true,
    });
    productModalFilter.id = "";
    productModalFilter.gp = "";
    productModalFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    this.props.updatePositions(true, "");
    this.props.deleteResponseService();
    this.props.getProductsGroupModal(productModalFilter);
    this.props.fetchAttributes("attributes", "product");
  };

  onChangeConsumption = (e) => {
    consumption = e.target.value;
    this.props.changeForm(true);

    this.setState({
      hasConsumption: true,
      consumptionValue: consumption,
    });
  };

  handlePutConsumption = () => {
    this.props.putConsumption(consumption);
  };
  showChildrenDrawer = () => {
    this.setState({
      showDrawerProductGroup: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      showDrawerProductGroup: false,
    });
  };

  onClose = () => {
    this.setState({
      showDrawerProduct: false,
    });
    this.props.updateSelectProductMultiConfirm(false, false, false);
  };

  getPrintPage = (id, br, pr, nm) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/bc/?bc=${br}&pr=${pr}&nm=${nm}`);
  };
  handleOpenCatalaog = () => {
    this.setState({
      visibleCatalog: true,
    });
    productModalFilter.id = "";
    productModalFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    productModalFilter.gp = "";
    productModalFilter.pg = 0;
    const barcodes = this.state.dataSource.map((r) => r.BarCode);
    this.setState(
      {
        selectedrow: this.state.dataSource,
        selectedid: barcodes,
      },
      () => {
        this.props.updateSelectedRows(
          this.state.selectedrow,
          this.state.selectedid
        );
      }
    );

    this.props.getProductsGroupModal(productModalFilter);
    this.props.updateSelectProductMultiConfirm(
      false,
      false,
      false,
      this.state.dataSource
    );
  };

  handleOpenMobileCatalog = () => {
    this.setState({
      visibleCatalog: true,
    });
    const barcodes = this.state.dataSource.map((r) => r.BarCode);
    this.setState(
      {
        selectedrow: this.state.dataSource,
        selectedid: barcodes,
      },
      () => {
        this.props.updateSelectedRows(
          this.state.selectedrow,
          this.state.selectedid
        );
      }
    );
    this.props.updateSelectProductMultiConfirm(
      false,
      false,
      false,
      this.state.dataSource
    );
  };

  handleCloseCatalog = () => {
    this.setState({
      visibleCatalog: false,
    });

    this.props.updateSelectProductMultiConfirm(
      true,
      false,
      false,
      this.state.dataSource
    );
  };

  handleFocus = (event) => event.target.select();

  handleCloseCatalogGancel = () => {
    this.setState({
      visibleCatalog: false,
    });
    this.props.updateSelectProductMultiConfirm(false, false, false);
  };

  handleVisibleChange = (flag) => {
    this.setState({ visibleMenuSettings: flag });
  };
  componentDidMount() {
    description = null;
    consumption = null;
    this.setState({
      copyDataSource: checkIfDuplicateExists(this.state.dataSource),
    });
    if (this.props.from === "demands") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          className: "salam",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Order"),
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,

          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (_, record) =>
            record.IsPack === 1 ? (
              <div className="packOrQuantityWrapper">
                {record.ShowPacket
                  ? `${ConvertFixedPosition(
                      record.Quantity
                    )}  (${ConvertFixedPosition(record.ChangePackQuantity)})`
                  : ConvertFixedPosition(record.Quantity)}
                <Select
                  labelInValue
                  style={{ width: 120 }}
                  value={{ value: record.ShowPacket ? "pack" : "pc" }}
                  defaultValue={{ value: "pc" }}
                  onChange={() => this.handleChange(record)}
                  onSelect={(e) => this.onSelect(e, record)}
                  onClick={handleClick}
                >
                  <Option value="pc">??d</Option>
                  <Option value="pack">Paket</Option>
                </Select>
              </div>
            ) : (
              <div className="packOrQuantityWrapper">
                {ConvertFixedPosition(record.Quantity)}{" "}
                <Select
                  className="disabledPacket"
                  labelInValue
                  showArrow={false}
                  defaultValue={{ value: "pc" }}
                  disabled={true}
                  style={{ width: 120 }}
                  onChange={() => this.handleChange(record)}
                >
                  <Option value="pc">??d</Option>
                </Select>
              </div>
            ),
        },

        {
          title: "Sat???? Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          editable: true,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, record) => (
            <div className="packOrQuantityWrapper">
              {ConvertFixedPosition(value)}
              {/* <Select
                labelInValue
                style={{ width: 120 }}
                defaultValue={{ value: "choose" }}
                onSelect={(e) => this.onSelectPrice(e, record)}
                onClick={handleClick}
                notFoundContent={<Spin size="small" />}
                onFocus={() => this.handlePrices(record)}
                dropdownRender={(menu) => (
                  <React.Fragment>
                    <div>
                      <Spin
                        className="customSpin"
                        spinning={this.state.loadingPrices}
                      >
                        {menu}
                      </Spin>
                    </div>
                  </React.Fragment>
                )}
              >
                <Option disabled value={"choose"}>
                  Se??in
                </Option>
                <Option value={"default"}>Sat???? qiym??ti</Option>
                {!this.state.loadingPrices
                  ? Object.values(this.state.docProPriceTypes).map((p) => (
                      <Option
                        className="mark_option_wrapper"
                        value={p.Price}
                        key={p.PriceType}
                      >
                        {this.props.state.prices.prices.find(
                          (mp) => mp.Id === p.PriceType
                        )
                          ? this.props.state.prices.prices.find(
                              (mp) => mp.Id === p.PriceType
                            ).Name
                          : ""}
                      </Option>
                    ))
                  : []}
              </Select> */}
            </div>
          ),
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: true,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Maya",
          dataIndex: "CostPrice",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "C??m Maya",
          dataIndex: "CostPriceTotal",
          isVisible: false,
          editable: false,

          ...this.getColumnSearchProps("CostPriceTotal"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: false,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.SellPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },
        {
          title: "Dublikat",
          dataIndex: "addSame",
          className: "printField",
          isVisible: false,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Dublikat?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleCopy(record, record.key)}
                >
                  <a className="addPosition">Dublikat</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
        {
          title: "Sil",
          dataIndex: "operation",
          className: "orderField printField",
          isVisible: true,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    }
    if (this.props.from === "supplies") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          className: "salam",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Order"),
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,

          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Al???? Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          editable: true,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: true,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Maya",
          dataIndex: "CostPr",
          className: "max_width_field",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("CostPr"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            defaultCostArray = [];
            poistionArray.forEach((p) => {
              defaultCostArray.push(Number(p.Price));
            });

            if (this.state.hasConsumption) {
              consumtionPriceArray = [];
              poistionArray.forEach((p) => {
                consumtionPriceArray.push(
                  FindAdditionals(
                    this.state.consumptionValue,
                    sumtotalprices,
                    Number(p.Price)
                  )
                );
              });

              return ConvertFixedTable(consumtionPriceArray[index]);
            } else {
              return ConvertFixedTable(defaultCostArray[index]);
            }
          },
        },

        {
          title: "C??m Maya",
          dataIndex: "CostTotalPr",
          className: "max_width_field",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("CostTotalPr"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            defaultCostArray = [];
            poistionArray.forEach((p) => {
              defaultCostArray.push(p.TotalPrice);
            });

            if (this.state.hasConsumption) {
              consumtionArray = [];
              poistionArray.forEach((p) => {
                consumtionArray.push(
                  FindAdditionals(
                    this.state.consumptionValue,
                    sumtotalprices,
                    p.TotalPrice
                  )
                );
              });
              return ConvertFixedTable(consumtionArray[index]);
            } else {
              return ConvertFixedTable(defaultCostArray[index]);
            }
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
          
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.PrintPrice,
                  row.Name
                )}
              >
              {

}    
                <PrinterOutlined />
              </span>
            ) : null,
        },
        {
          title: "Sil",
          dataIndex: "operation",
          className: "orderField printField",
          isVisible: true,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    }
    if (this.props.from === "supplyreturns") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          className: "salam",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Order"),
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,

          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Al???? Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          editable: this.props.saledoc ? false : true,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: this.props.saledoc ? false : true,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.PrintPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },
        {
          title: "Sil",
          dataIndex: "operation",
          className: "orderField printField",
          isVisible: true,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    }
    if (this.props.from === "demandreturns") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Order"),
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,

          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (_, record) =>
            record.IsPack === 1 ? (
              <div className="packOrQuantityWrapper">
                {record.ShowPacket
                  ? `${ConvertFixedPosition(
                      record.Quantity
                    )}  (${ConvertFixedPosition(record.ChangePackQuantity)})`
                  : ConvertFixedPosition(record.Quantity)}
                <Select
                  labelInValue
                  style={{ width: 120 }}
                  value={{ value: record.ShowPacket ? "pack" : "pc" }}
                  defaultValue={{ value: "pc" }}
                  onChange={() => this.handleChange(record)}
                  onSelect={(e) => this.onSelect(e, record)}
                  onClick={handleClick}
                >
                  <Option value="pc">??d</Option>
                  <Option value="pack">Paket</Option>
                </Select>
              </div>
            ) : (
              <div className="packOrQuantityWrapper">
                {ConvertFixedPosition(record.Quantity)}{" "}
                <Select
                  className="disabledPacket"
                  labelInValue
                  showArrow={false}
                  defaultValue={{ value: "pc" }}
                  disabled={true}
                  style={{ width: 120 }}
                  onChange={() => this.handleChange(record)}
                >
                  <Option value="pc">??d</Option>
                </Select>
              </div>
            ),
        },

        {
          title: "Sat???? Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          editable: this.props.saledoc ? false : true,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: this.props.saledoc ? false : true,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.SellPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },
        {
          title: "Sil",
          dataIndex: "operation",
          className: "orderField printField",
          isVisible: true,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    }
    if (this.props.from === "sales") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Order"),
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,

          editable: false,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (_, record) =>
            record.IsPack === 1 ? (
              <div className="packOrQuantityWrapper">
                {record.ShowPacket
                  ? `${ConvertFixedPosition(
                      record.Quantity
                    )}  (${ConvertFixedPosition(record.ChangePackQuantity)})`
                  : ConvertFixedPosition(record.Quantity)}
                <Select
                  labelInValue
                  style={{ width: 120 }}
                  value={{ value: record.ShowPacket ? "pack" : "pc" }}
                  defaultValue={{ value: "pc" }}
                  onChange={() => this.handleChange(record)}
                  onSelect={(e) => this.onSelect(e, record)}
                  onClick={handleClick}
                >
                  <Option value="pc">??d</Option>
                  <Option value="pack">Paket</Option>
                </Select>
              </div>
            ) : (
              <div className="packOrQuantityWrapper">
                {ConvertFixedPosition(record.Quantity)}{" "}
                <Select
                  className="disabledPacket"
                  labelInValue
                  showArrow={false}
                  defaultValue={{ value: "pc" }}
                  disabled={true}
                  style={{ width: 120 }}
                  onChange={() => this.handleChange(record)}
                >
                  <Option value="pc">??d</Option>
                </Select>
              </div>
            ),
        },

        {
          title: "Sat???? Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          editable: false,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Endirim",
          dataIndex: "Discount",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("Discount"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.SellPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },

        {
          title: "Sil",
          dataIndex: "operation",
          className: "orderField printField",
          isVisible: true,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    } else if (this.props.from === "enters") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          className: "orderField",
          editable: false,
          isVisible: true,
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          className: "max_width_field_length",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          className: "max_width_field_length",
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,
          className: "max_width_field",
          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          className: "max_width_field",
          editable: true,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          className: "max_width_field",
          editable: true,

          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          className: "max_width_field",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Maya",
          dataIndex: "CostPr",
          className: "max_width_field",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("CostPr"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            defaultCostArray = [];
            poistionArray.forEach((p) => {
              defaultCostArray.push(Number(p.Price));
            });

            if (this.state.hasConsumption) {
              consumtionPriceArray = [];
              poistionArray.forEach((p) => {
                consumtionPriceArray.push(
                  FindAdditionals(
                    this.state.consumptionValue,
                    sumtotalprices,
                    Number(p.Price)
                  )
                );
              });

              return ConvertFixedTable(consumtionPriceArray[index]);
            } else {
              return ConvertFixedTable(defaultCostArray[index]);
            }
          },
        },

        {
          title: "C??m Maya",
          dataIndex: "CostTotalPr",
          className: "max_width_field",
          isVisible: true,
          editable: false,

          ...this.getColumnSearchProps("CostTotalPr"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            defaultCostArray = [];
            poistionArray.forEach((p) => {
              defaultCostArray.push(Number(p.TotalPrice));
            });

            if (this.state.hasConsumption) {
              consumtionArray = [];

              poistionArray.forEach((p) => {
                consumtionArray.push(
                  FindAdditionals(
                    this.state.consumptionValue,
                    sumtotalprices,
                    p.TotalPrice
                  )
                );
              });
              return ConvertFixedTable(consumtionArray[index]);
            } else {
              return ConvertFixedTable(defaultCostArray[index]);
            }
          },
        },

        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.PrintPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },

        {
          title: "Sil",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    } else if (this.props.from === "losses") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          className: "orderField",
          editable: false,
          isVisible: true,
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          className: "max_width_field_length",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          className: "max_width_field_length",
          isVisible: true,
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          className: "max_width_field",
          isVisible: true,

          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Qiym??ti",
          dataIndex: "Price",
          isVisible: true,
          className: "max_width_field",
          editable: false,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: false,
          className: "max_width_field",
          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: true,
          editable: false,
          className: "max_width_field",

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.PrintPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },

        {
          title: "Sil",
          dataIndex: "operation",
          isVisible: true,
          className: "orderField printField",
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    } else if (this.props.from === "moves") {
      headerColumns = [
        {
          title: "???",
          dataIndex: "Order",
          className: "orderField",
          editable: false,
          isVisible: true,
          render: (text, record, index) => index + 1,
        },
        {
          title: "Ad??",
          dataIndex: "Name",
          className: "max_width_field_length",
          editable: false,
          isVisible: true,
          ...this.getColumnSearchProps("Name"),
          sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
          title: "Barkodu",
          dataIndex: "BarCode",
          isVisible: true,
          className: "max_width_field_length",
          editable: false,
          sortDirections: ["descend", "ascend"],
          ...this.getColumnSearchProps("BarCode"),
          sorter: (a, b) => a.BarCode - b.BarCode,
        },
        {
          title: "Miqdar",
          dataIndex: "Quantity",
          isVisible: true,
          className: "max_width_field",
          editable: true,
          ...this.getColumnSearchProps("Quantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },

        {
          title: "Maya",
          dataIndex: "Price",
          isVisible: true,
          className: "max_width_field",
          editable: false,
          ...this.getColumnSearchProps("Price"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "M??bl????",
          dataIndex: "TotalPrice",
          isVisible: true,
          editable: false,
          className: "max_width_field",
          ...this.getColumnSearchProps("CostPrice"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Qal??q",
          dataIndex: "StockQuantity",
          isVisible: false,
          className: "max_width_field",
          editable: false,

          ...this.getColumnSearchProps("StockQuantity"),
          sortDirections: ["descend", "ascend"],
          render: (value, row, index) => {
            // do something like adding commas to the value or prefix
            return ConvertFixedPosition(value);
          },
        },
        {
          title: "Print",
          className: "orderField printField",
          dataIndex: "operation",
          isVisible: true,
          editable: false,
          render: (value, row, index) =>
            this.state.dataSource.length >= 1 ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getPrintPage(
                  row.ProductId,
                  row.BarCode,
                  row.PrintPrice,
                  row.Name
                )}
              >
                <PrinterOutlined />
              </span>
            ) : null,
        },
        {
          title: "Sil",
          dataIndex: "operation",
          isVisible: true,
          className: "orderField printField",
          editable: false,
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Typography.Link>
                <Popconfirm
                  title="Silm??y?? ??minsinizmi?"
                  okText="B??li"
                  cancelText="Xeyr"
                  onConfirm={() => this.handleDelete(record.key)}
                >
                  <a className="deletePosition">Sil</a>
                </Popconfirm>
              </Typography.Link>
            ) : null,
        },
      ];

      this.setState({
        columns: headerColumns.filter((c) => c.isVisible == true),
        initialCols: headerColumns,
      });
    }

    const handler = (e) => this.setState({ matches: e.matches });
    window.matchMedia("(min-width: 600px)").addEventListener("change", handler);
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  handleChange = (value) => {};

  async getProductPrice(object) {
    const res = await axios.post(
      "https://dev.bein.az/controllers/products/get.php",
      object
    );
    return await res;
  }
  handlePrices = (record) => {
    this.setState({
      loadingPrices: true,
      docProPriceTypes: [],
    });
    var id = record.key;
    var getPricesFilter = {};
    getPricesFilter.id = id;
    getPricesFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    this.getProductPrice(getPricesFilter).then((res) =>
      this.setState({
        docProPriceTypes: res.data.Body.List[0].Prices,
        loadingPrices: false,
      })
    );
  };

  onSelectPrice = (e, record) => {
    const prevdatasource = [...this.state.dataSource];
    const index = prevdatasource.findIndex((item) => record.key === item.key);
    const item = prevdatasource[index];
    item.Price = e.label != "Sat???? qiym??ti" ? e.value : record.SellPrice;
    item.TotalPrice = item.Price * item.Quantity;
    prevdatasource.splice(index, 1, { ...item, ...prevdatasource });
    this.setState({
      dataSource: prevdatasource,
    });
  };

  async getAllPricesRate(object) {
    const res = await axios.post(
      `${API_BASE}/products/getproductsrate.php`,
      object
    );
    return await res;
  }

  handleClearPrices = () => {
    this.setState({
      loadingTableChangePrice: true,
    });
    const prevdatasource = [...this.state.dataSource];
    Object.values(prevdatasource).map((item) => {
      item.Price = item.SellPrice;
      item.TotalPrice = item.Price * item.Quantity;
    });

    this.setState({
      dataSource: prevdatasource,
      loadingTableChangePrice: false,
    });
  };

  getAllPrices = () => {
    this.props.fetchPrices();
  };
  handleAllPrice = (e) => {

    if (e === "0000") {
      this.handleClearPrices();
    } else {
      this.setState({
        loadingTableChangePrice: true,
      });
      const prevdatasource = [...this.state.dataSource];
      Object.values(prevdatasource).map((item) => {
        item.Price = 0;
        item.TotalPrice = item.Price * item.Quantity;
      });
      this.setState({
        dataSource: prevdatasource,
      });
      var getAllPricesFilter = {};
      var productsId = [];
      getAllPricesFilter.token = JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user")).Token
        : "";
      getAllPricesFilter.pricetype = e;
      Object.values(this.state.dataSource).map((d) =>
        productsId.push(d.ProductId)
      );
      getAllPricesFilter.products = productsId;
      this.getAllPricesRate(getAllPricesFilter)
        .then((res) =>
          res.data.Body.List.map((i) => {
            Object.values(this.state.dataSource).map((item) => {
              if (item.ProductId === i.ProductId) {
                item.Price = i.Price;
                item.TotalPrice = i.Price * item.Quantity;
              }
            });
          })
        )
        .then(() => {
          const prevDataSource = [...this.state.dataSource];
          this.setState({
            dataSource: prevDataSource,
            loadingTableChangePrice: false,
          });
        });
    }
  };
  onSelect = (e, record) => {
    const prevdatasource = [...this.state.dataSource];
    const index = prevdatasource.findIndex((item) => record.key === item.key);
    const item = prevdatasource[index];
    if (e.value === "pack") {
      item.TotalPrice = item.PackPrice * item.Quantity;
      item.Price = parseFloat(
        item.TotalPrice / item.ChangePackQuantity
      ).toFixed(4);
      item.ShowPacket = true;
      prevdatasource.splice(index, 1, { ...item, ...prevdatasource });
      this.setState({
        dataSource: prevdatasource,
      });
    } else if (e.value === "pc") {
      item.Price = item.SellPrice;
      item.TotalPrice = item.Price * item.Quantity;
      item.ShowPacket = false;
      prevdatasource.splice(index, 1, { ...item, ...prevdatasource });
      this.setState({
        dataSource: prevdatasource,
      });
    }
  };

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    const selectedRowKeys = [...this.state.selectedRowKeys];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
      selectedRowKeys: selectedRowKeys.filter((item) => item !== key),
    });
  };
  handleCopy = (record, key) => {
    const prevdataSource = [...this.state.dataSource];
    var index;
    var newData = {};
    Object.assign(newData, record);
    newData.key = Math.random();
    prevdataSource.push(newData);

    this.setState({
      dataSource: prevdataSource,
    });
  };
  handleDeleteDataSoruce = () => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter(
        (item) =>
          item.key !== this.state.selectedRowKeys.find((k) => k == item.key)
      ),
      selectedRowKeys: [],
    });
  };
  handleSwitch = (checked) => {
    var foundedColumnPack = this.columns.find(
      (c) => c.dataIndex === "PackQuantity"
    );
    var foundedColumnPackIndex = this.columns.findIndex(
      (c) => c.dataIndex === "PackQuantity"
    );

    var quantityColumn = this.columns.find((c) => c.dataIndex === "Quantity");
    var quantityColumnIndex = this.columns.findIndex(
      (c) => c.dataIndex === "Quantity"
    );
    foundedColumnPack.isVisible = checked;
    foundedColumnPack.editable = checked;
    quantityColumn.editable = checked;
    var newColumnPack = foundedColumnPack;
    var newQuantityColumnPack = quantityColumn;
    this.columns.splice(foundedColumnPackIndex, 1, {
      ...foundedColumnPack,
      ...newColumnPack,
    });
    this.columns.splice(quantityColumnIndex, 1, {
      ...quantityColumn,
      ...newQuantityColumnPack,
    });
    this.setState({
      showpacket: checked,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    item.Quantity != newData[index].Quantity
      ? newData.map((n) => {
          if (n.ShowPacket) {
            n.TotalPrice = parseFloat(n.PackPrice) * parseFloat(n.Quantity);
          } else {
            n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity);
          }
          n.ChangePackQuantity =
            parseFloat(n.PackQuantity) * parseFloat(n.Quantity);
        })
      : item.Price != newData[index].Price
      ? newData.map(
          (n) => (n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity))
        )
      : item.TotalPrice != newData[index].TotalPrice
      ? newData.map(
          (n) => (n.Price = parseFloat(n.TotalPrice) / parseFloat(n.Quantity))
        )
      : newData.map(
          (n) => (n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity))
        );

    this.setState({
      dataSource: newData,
      hasConsumption: true,
    });
  };
  onChange = (e) => {
    var initialCols = this.state.initialCols;
    var findelement;
    var findelementindex;
    var replacedElement;
    findelement = initialCols.find((c) => c.dataIndex === e.target.id);
    findelementindex = initialCols.findIndex(
      (c) => c.dataIndex === e.target.id
    );
    findelement.isVisible = e.target.checked;
    replacedElement = findelement;
    initialCols.splice(findelementindex, 1, {
      ...findelement,
      ...replacedElement,
    });
    var filtered = initialCols.filter((c) => c.isVisible == true);
    this.setState({
      columns: filtered,
    });
  };
  handleTabChange = (event, data) => {
    if (data.activeIndex === 1) {
      this.props.getLinks(this.props.linkedid, "demand");
    } else {
    }
  };

  stopPlay = () => {
    this.setState({
      playstatus: false,
    });
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextState.dataSource && nextState.dataSource != this.state.dataSource) {
      this.setState({
        copyDataSource: checkIfDuplicateExists(nextState.dataSource),
      });
      this.props.changeForm(true);
      if (
        Object.keys(nextState.dataSource).length !=
        Object.keys(this.state.dataSource).length
      ) {
        audio.play();
      }
    }
  }

  // customposition array add key and totaolprice datas

  componentWillReceiveProps(nextProps, nextState) {
    if (
      nextProps.state.savedoc.createDoc &&
      nextProps.state.savedoc.createDoc.Positions &&
      nextProps.state.savedoc.createDoc != this.props.state.createDoc
    ) {
      customPositions = [];
      Object.values(nextProps.state.savedoc.createDoc.Positions).map((d) =>
        customPositions.push(d)
      );
      customPositions.map((c) => (c.key = c.ProductId));
      customPositions.map((c) => (c.SellPrice = c.Price));
      customPositions.map((c) => (c.DefaultQuantity = c.Quantity));
      customPositions.map(
        (c) => (c.TotalPrice = parseFloat(c.Price) * parseFloat(c.Quantity))
      );
      customPositions.map(
        (c) =>
          (c.CostPriceTotal = parseFloat(c.CostPrice) * parseFloat(c.Quantity))
      );
      this.setState({
        dataSource: customPositions.length > 0 ? customPositions : [],
        playstatus: false,
      });
    }

    if (this.state.hasConsumption) {
      consumtionArray = [];
      consumtionPriceArray = [];
      poistionArray.forEach((p) => {
        consumtionArray.push(
          FindAdditionals(
            this.state.consumptionValue,
            sumtotalprices,
            p.TotalPrice
          )
        );
      });
      poistionArray.forEach((p) => {
        consumtionPriceArray.push(
          FindAdditionals(this.state.consumptionValue, sumtotalprices, p.Price)
        );
      });
    }

    if (nextProps.state.stateChanges.isConfirm === true) {
      this.props.updateSelectProductMultiConfirm(false, false, false);
      var duplicateData = false;
      var newData = {};
      var index;
      var multiselectdatas = [];
      if (
        this.props.from === "demands" ||
        this.props.from === "demandreturns"
      ) {
        var selectedRows = nextProps.state.stateChanges.selectedRows;
        for (let i = 0; i < Object.keys(selectedRows).length; i++) {
          multiselectdatas.push(
            (newData = {
              key: Math.random(),
              Id: selectedRows[i].ProductId
                ? selectedRows[i].ProductId
                : selectedRows[i].Id,
              ProductId: selectedRows[i].ProductId
                ? selectedRows[i].ProductId
                : selectedRows[i].Id,
              ArtCode: selectedRows[i].ArtCode,
              Name: selectedRows[i].Name,
              BarCode: selectedRows[i].BarCode,
              Quantity: selectedRows[i].Quantity ? selectedRows[i].Quantity : 1,
              SellPrice: selectedRows[i].Price,
              Price: selectedRows[i].Price,
              TotalPrice: selectedRows[i].Quantity
                ? selectedRows[i].Quantity * selectedRows[i].Price
                : selectedRows[i].Price,
              ShowPacket: false,
              PackQuantity:
                selectedRows[i].IsPack === 1
                  ? selectedRows[i].PackQuantity
                  : "",
              ChangePackQuantity:
                selectedRows[i].IsPack === 1
                  ? selectedRows[i].PackQuantity
                  : "",
              PackPrice:
                selectedRows[i].IsPack === 1 ? selectedRows[i].PackPrice : "",
              IsPack: selectedRows[i].IsPack,
              StockQuantity: selectedRows[i].StockBalance
                ? selectedRows[i].StockBalance
                : "0.00",
              CostPrice: selectedRows[i].CostPrice,
              CostPriceTotal: selectedRows[i].CostPriceTotal,
            })
          );
        }

        var newDataSource = this.state.dataSource.concat(multiselectdatas);
        var arr = uniqByKeepFirst(newDataSource, (it) => it.BarCode);
        this.setState({
          dataSource: [...arr],
        });
      } else if (
        this.props.from === "supplies" ||
        this.props.from === "supplyreturns" ||
        this.props.from === "enters" ||
        this.props.from === "losses"
      ) {
        var selectedRows = nextProps.state.stateChanges.selectedRows;
        for (let i = 0; i < Object.keys(selectedRows).length; i++) {
          multiselectdatas.push(
            (newData = {
              key: Math.random(),
              Id: selectedRows[i].ProductId
                ? selectedRows[i].ProductId
                : selectedRows[i].Id,
              ProductId: selectedRows[i].ProductId
                ? selectedRows[i].ProductId
                : selectedRows[i].Id,
              ArtCode: selectedRows[i].ArtCode,
              Name: selectedRows[i].Name,
              BarCode: selectedRows[i].BarCode,
              Quantity: selectedRows[i].Quantity ? selectedRows[i].Quantity : 1,
              SellPrice: selectedRows[i].BuyPrice,
              PrintPrice: selectedRows[i].Price,
              Price: selectedRows[i].BuyPrice,
              TotalPrice: selectedRows[i].Quantity
                ? selectedRows[i].Quantity * selectedRows[i].BuyPrice
                : selectedRows[i].BuyPrice,
              CostPr: selectedRows[i].BuyPrice,
              CostTotalPr: selectedRows[i].Quantity
                ? selectedRows[i].Quantity * selectedRows[i].BuyPrice
                : selectedRows[i].BuyPrice,
              ShowPacket: false,
              PackQuantity:
                selectedRows[i].IsPack === 1
                  ? selectedRows[i].PackQuantity
                  : "",
              ChangePackQuantity:
                selectedRows[i].IsPack === 1
                  ? selectedRows[i].PackQuantity
                  : "",
              PackPrice:
                selectedRows[i].IsPack === 1 ? selectedRows[i].PackPrice : "",
              IsPack: selectedRows[i].IsPack,
              StockQuantity: selectedRows[i].StockBalance
                ? selectedRows[i].StockBalance
                : "0.00",
              CostPrice: selectedRows[i].CostPrice,
              CostPriceTotal: selectedRows[i].CostPriceTotal,
            })
          );
        }

        var newDataSource = this.state.dataSource.concat(multiselectdatas);
        var arr = uniqByKeepFirst(newDataSource, (it) => it.BarCode);
        this.setState({
          dataSource: [...arr],
        });
      } else if (this.props.from === "moves") {
        var selectedRows = nextProps.state.stateChanges.selectedRows;
        for (let i = 0; i < Object.keys(selectedRows).length; i++) {
          multiselectdatas.push(
            (newData = {
              key: Math.random(),
              Id: selectedRows[i].ProductId
                ? selectedRows[i].ProductId
                : selectedRows[i].Id,
              ProductId: selectedRows[i].ProductId
                ? selectedRows[i].ProductId
                : selectedRows[i].Id,
              ArtCode: selectedRows[i].ArtCode,
              Name: selectedRows[i].Name,
              BarCode: selectedRows[i].BarCode,
              Quantity: selectedRows[i].Quantity ? selectedRows[i].Quantity : 1,
              SellPrice: selectedRows[i].CostPrice
                ? selectedRows[i].CostPrice
                : 0,
              Price: selectedRows[i].CostPrice ? selectedRows[i].CostPrice : 0,
              TotalPrice: selectedRows[i].Quantity
                ? selectedRows[i].Quantity * selectedRows[i].CostPrice
                  ? selectedRows[i].CostPrice
                  : 0
                : selectedRows[i].CostPrice
                ? selectedRows[i].CostPrice
                : 0,
              ShowPacket: false,
              PackQuantity:
                selectedRows[i].IsPack === 1
                  ? selectedRows[i].PackQuantity
                  : "",
              ChangePackQuantity:
                selectedRows[i].IsPack === 1
                  ? selectedRows[i].PackQuantity
                  : "",
              PackPrice:
                selectedRows[i].IsPack === 1 ? selectedRows[i].PackPrice : "",
              IsPack: selectedRows[i].IsPack,
              StockQuantity: selectedRows[i].Quantity
                ? selectedRows[i].Quantity
                : "0.00",
              CostPrice: selectedRows[i].CostPrice
                ? selectedRows[i].CostPrice
                : 0,
              CostPriceTotal: selectedRows[i].CostPriceTotal,
            })
          );
        }

        var newDataSource = this.state.dataSource.concat(multiselectdatas);
        var arr = uniqByKeepFirst(newDataSource, (it) => it.BarCode);
        this.setState({
          dataSource: [...arr],
        });
      }
    }
    if (nextProps.state.stateChanges.isNewProduct === true) {
      this.props.updateSelectProductMultiConfirm(false, false, false);
      var newData = {};
      if (
        this.props.from === "demands" ||
        this.props.from === "demandreturns"
      ) {
        if (nextProps.state.docmodals.localStates) {
          newData = {
            key: Math.random(),
            Id: nextProps.state.docmodals.newid
              ? nextProps.state.docmodals.newid
              : "",
            ProductId: nextProps.state.docmodals.newid
              ? nextProps.state.docmodals.newid
              : "",
            ArtCode: nextProps.state.docmodals.localStates.artcode
              ? nextProps.state.docmodals.localStates.artcode
              : "",
            Name: nextProps.state.docmodals.localStates.name
              ? nextProps.state.docmodals.localStates.name
              : "",
            BarCode: nextProps.state.docmodals.localStates.barcode
              ? String(nextProps.state.docmodals.localStates.barcode)
              : "",
            Quantity: 1,
            SellPrice: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.price
              : 0,
            Price: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.price
              : 0,
            TotalPrice: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.price
              : 0,
            ShowPacket: false,
            PackQuantity:
              nextProps.state.docmodals.localStates.ispack === 1
                ? nextProps.state.docmodals.localStates.packquantity
                : "",
            ChangePackQuantity:
              nextProps.state.docmodals.localStates.ispack === 1
                ? nextProps.state.docmodals.localStates.packquantity
                : "",
            PackPrice:
              nextProps.state.docmodals.localStates.ispack === 1
                ? nextProps.state.docmodals.localStates.packprice
                : "",
            IsPack: nextProps.state.docmodals.localStates.ispack
              ? nextProps.state.docmodals.localStates.ispack
              : 0,
            StockQuantity: nextProps.state.docmodals.localStates.quantity
              ? nextProps.state.docmodals.localStates.quantity
              : "0.00",
            CostPrice: nextProps.state.docmodals.localStates.costprice
              ? nextProps.state.docmodals.localStates.costprice
              : "0.00",
            CostPriceTotal: nextProps.state.docmodals.localStates.costprice
              ? nextProps.state.docmodals.localStates.costprice
              : "0.00",
          };

          var datas = [...this.state.dataSource];
          datas.unshift(newData);
          this.setState({
            dataSource: datas,
            showDrawerProduct: false,
          });
        }
      } else if (
        this.props.from === "supplies" ||
        this.props.from === "supplyreturns" ||
        this.props.from === "enters" ||
        this.props.from === "losses" ||
        this.props.from === "moves"
      ) {
        if (nextProps.state.docmodals.localStates) {
          newData = {
            key: Math.random(),
            Id: nextProps.state.docmodals.newid
              ? nextProps.state.docmodals.newid
              : "",
            ProductId: nextProps.state.docmodals.newid
              ? nextProps.state.docmodals.newid
              : "",
            ArtCode: nextProps.state.docmodals.localStates.artcode
              ? nextProps.state.docmodals.localStates.artcode
              : "",
            Name: nextProps.state.docmodals.localStates.name
              ? nextProps.state.docmodals.localStates.name
              : "",
            BarCode: nextProps.state.docmodals.localStates.barcode
              ? String(nextProps.state.docmodals.localStates.barcode)
              : "",
            Quantity: "1",
            SellPrice: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.buyprice
              : 0,
                  PrintPrice: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.price
              : 0,
            Price: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.buyprice
              : 0,
            TotalPrice: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.buyprice
              : 0,
            CostPr: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.buyprice
              : 0,
            CostTotalPr: nextProps.state.docmodals.localStates.price
              ? nextProps.state.docmodals.localStates.buyprice
              : 0,
            ShowPacket: false,
            PackQuantity:
              nextProps.state.docmodals.localStates.ispack === 1
                ? nextProps.state.docmodals.localStates.packquantity
                : "",
            ChangePackQuantity:
              nextProps.state.docmodals.localStates.ispack === 1
                ? nextProps.state.docmodals.localStates.packquantity
                : "",
            PackPrice:
              nextProps.state.docmodals.localStates.ispack === 1
                ? nextProps.state.docmodals.localStates.packprice
                : "",
            IsPack: nextProps.state.docmodals.localStates.ispack
              ? nextProps.state.docmodals.localStates.ispack
              : 0,
            StockQuantity: nextProps.state.docmodals.localStates.quantity
              ? nextProps.state.docmodals.localStates.quantity
              : "0.00",
            CostPrice: nextProps.state.docmodals.localStates.costprice
              ? nextProps.state.docmodals.localStates.costprice
              : "0.00",
            CostPriceTotal: nextProps.state.docmodals.localStates.costprice
              ? nextProps.state.docmodals.localStates.costprice
              : "0.00",
          };

          var datas = [...this.state.dataSource];
          datas.unshift(newData);
          this.setState({
            dataSource: datas,
            showDrawerProduct: false,
          });
        }
      }
    }

    if (nextProps.state.stateChanges.isAddProduct === true) {
      if (nextProps.state.handleProduct.selectedProduct != "") {
        this.props.updateSelectProductMultiConfirm(false, false, false);
        var prevdatasource = [...this.state.dataSource];
        var duplicateData = false;
        var index;
        var newData = {};
        if (this.props.from === "enters") {
          newData = {
            key: Math.random(),
            Id: nextProps.state.handleProduct.selectedProduct.value,
            DefaultId: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
                 PrintPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.price
            ),
            Price: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            CostPr: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            BuyPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            TotalPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            CostTotalPr: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        } else if (this.props.from === "losses") {
          newData = {
            key: Math.random(),
            Id: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
               PrintPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.price
            ),
            BuyPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            Price: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            TotalPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            CostPr: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            CostTotalPr: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        } else if (this.props.from === "moves") {
          newData = {
            key: Math.random(),
            Id: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.costprice
            ),
                 PrintPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.price
            ),
            Price: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.costprice
            ),
            TotalPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.costprice * 1
            ),
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        } else if (this.props.from === "supplies") {
          newData = {
            key: nextProps.state.handleProduct.selectedProduct.value,
            Id: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
             PrintPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.price
            ),
            Price: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            BuyPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            TotalPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            CostPr: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            CostTotalPr: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        } else if (this.props.from === "demands") {
          newData = {
            key: Math.random(),
            Id: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: nextProps.state.handleProduct.selectedProduct.price,
            Price: nextProps.state.handleProduct.selectedProduct.price,
            TotalPrice:
              nextProps.state.handleProduct.selectedProduct.totalprice,
            ShowPacket: false,
            PackQuantity:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packquantity
                : "",
            ChangePackQuantity:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packquantity
                : "",
            PackPrice:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packprice
                : "",
            IsPack: nextProps.state.handleProduct.selectedProduct.ispack,
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        } else if (this.props.from === "demandreturns") {
          newData = {
            key: nextProps.state.handleProduct.selectedProduct.value,
            Id: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: nextProps.state.handleProduct.selectedProduct.price,
            Price: nextProps.state.handleProduct.selectedProduct.price,
            TotalPrice:
              nextProps.state.handleProduct.selectedProduct.totalprice,
            ShowPacket: false,
            PackQuantity:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packquantity
                : "",
            ChangePackQuantity:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packquantity
                : "",
            PackPrice:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packprice
                : "",
            IsPack: nextProps.state.handleProduct.selectedProduct.ispack,
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        } else if (this.props.from === "supplyreturns") {
          newData = {
            key: nextProps.state.handleProduct.selectedProduct.value,
            Id: nextProps.state.handleProduct.selectedProduct.value,
            ProductId: nextProps.state.handleProduct.selectedProduct.value,
            ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
            Name: nextProps.state.handleProduct.selectedProduct.name,
            BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
            Quantity: nextProps.state.handleProduct.selectedProduct.amount,
            SellPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
                 PrintPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.price
            ),
            Price: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice
            ),
            TotalPrice: ConvertFixedTable(
              nextProps.state.handleProduct.selectedProduct.buyprice * 1
            ),
            ShowPacket: false,
            PackQuantity:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packquantity
                : "",
            ChangePackQuantity:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packquantity
                : "",
            PackPrice:
              nextProps.state.handleProduct.selectedProduct.ispack === 1
                ? nextProps.state.handleProduct.selectedProduct.packprice
                : "",
            IsPack: nextProps.state.handleProduct.selectedProduct.ispack,
            StockQuantity: nextProps.state.handleProduct.selectedProduct
              .stockquantity
              ? nextProps.state.handleProduct.selectedProduct.stockquantity
              : "0.00",
            CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
            CostPriceTotal:
              nextProps.state.handleProduct.selectedProduct.costpricetotal,
          };
        }
        prevdatasource.find(
          (pd) => String(pd.ProductId) === String(newData.ProductId)
        )
          ? (duplicateData = true)
          : (duplicateData = false);
        index = prevdatasource.findIndex(
          (pd) => String(pd.ProductId) === String(newData.ProductId)
        );
        if (duplicateData === false) {
          var datas = [...this.state.dataSource];
          datas.unshift(newData);
          this.setState({
            dataSource: datas,
          });
        } else {
          this.setState({
            dataSource: AddRepeatProduct(prevdatasource, index, newData),
          });
        }
      }
    }
  }
  render() {
    const { dataSource, selectedRowKeys } = this.state;
    console.log('DATASOURCE',dataSource)
    selectAllPrices = [];
    changedPositions = dataSource;
    sumtotalprices = 0;
    var sumcount = 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          className: col.className,
          dataIndex: col.dataIndex,
          title: col.title,
          saledoc: this.props.saledoc ? true : false,
          handleSave: this.handleSave,
        }),
      };
    });
    linkedArray = [];
    if (this.props.from === "demands") {
      this.props.state.links.links.map((link) => {
        linkedArray.push({
          id: link.Id,
          name: link.Name,
          title: link.DocType,
        });
      });
    }
    const menu = (
      <Menu>
        <Menu.ItemGroup title={<Trans word={"columns"} />}>
          {Object.values(this.state.initialCols).map((d) => (
            <Menu.Item key={d.dataIndex}>
              <Checkbox
                id={d.dataIndex}
                disabled={
                  this.state.columns.length === 3 && d.isVisible === true
                    ? true
                    : false
                }
                isVisible={d.isVisible}
                onChange={this.onChange}
                defaultChecked={d.isVisible}
              >
                {d.title}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    );
    const panes = [
      {
        menuItem: "??sas",
        render: () => (
          <Tab.Pane attached={false}>
            {this.props.from === "sales" ? "" : tablePart}
            <div className="selectedItemsWrapper">
              <Dropdown
                overlay={menu}
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.visibleMenuSettings}
              >
                <Button className="flex_directon_col_center">
                  {" "}
                  <SettingOutlined />
                </Button>
              </Dropdown>
              <p
                className="selectedItems"
                style={{
                  display: this.state.copyDataSource ? "flex" : "none",
                }}
              >
                T??krarlanan m??hsul var
              </p>
              <p
                className="selectedItems"
                style={{
                  display:
                    this.state.selectedRowKeys.length > 0 ? "flex" : "none",
                }}
              >
                Se??ilib : {this.state.selectedRowKeys.length}{" "}
                <DeleteOutlined onClick={this.handleDeleteDataSoruce} />
              </p>
            </div>

            <Table
              components={components}
              rowClassName={() => "editable-row"}
              loading={this.state.loadingTableChangePrice}
              className="doctable"
              bordered
              dataSource={dataSource}
              scroll={{ x: !this.state.matches ? 1500 : null }}
              columns={columns}
              pagination={{ defaultPageSize: 100 }}
              rowSelection={rowSelection}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="S??n??d bo??dur..."
                  />
                ),
              }}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "??laq??li s??n??dl??r",
        render: () => (
          <Tab.Pane attached={false}>
            <OrgChartLinkedDocs nodes={linkedArray} />
          </Tab.Pane>
        ),
      },
    ];
    inputsNameArray = [];
    if (Array.isArray(JSON.parse(localStorage.getItem("attributes")))) {
          Object.values(JSON.parse(localStorage.getItem("attributes"))).map(
            (c) => {
              inputsNameArray.push({
                name: "col_" + c.Name,
                label: c.Title,
                isrequired: c.IsRequired,
                referencetypeid: c.ReferenceTypeId,
                valuetype: c.ValueType,
                entitytype: c.EntityType,
                isfilter: c.IsFilter,
                id: c.Id,
              });
            }
          );
   }


    if (this.props.from === "sales") {
      Object.values(this.state.dataSource).map((c) => {
        c.BasicPrice != 0
          ? (c.Discount =
              ConvertFixedTable(
                parseFloat(((c.BasicPrice - c.Price) / c.BasicPrice) * 100)
              ) + " %")
          : (c.Discount = ConvertFixedTable(0) + " %");
      });
    }

    if (Array.isArray(this.props.state.prices.prices)) {
      Object.values(this.props.state.prices.prices).map((p) => {
        selectAllPrices.push({
          label: p.Name,
          value: p.Id,
        });
      });
    }

    selectAllPrices.unshift({
      label: "Sat???? qiym??ti",
      value: "0000",
    });

    const tablePart = (
      <Row className="addProductInputWrapper">
        <Col xs={24} md={12} xl={9}>
          <div className="addProductInputIcon">
            <AddProInputNew
              saledoc={this.props.saledoc}
              doc={this.props.doc}
              from={this.props.from}
              positions={this.state.dataSource}
            />
            <PlusOutlined
              style={{
                display:
                  this.props.from === "supplyreturns" ||
                  this.props.from === "demandreturns"
                    ? this.props.saledoc
                      ? "none"
                      : "block"
                    : "block",
              }}
              className="addNewProductIcon"
              onClick={this.showDrawer}
            />
          </div>
        </Col>
        <Col xs={24} md={12} xl={3} className="catalog_button_wrapper">
          <Button
            disabled={
              this.props.from === "supplyreturns" ||
              this.props.from === "demandreturns"
                ? this.props.saledoc
                  ? true
                  : false
                : false
            }
            type="primary"
            icon={<CheckSquareOutlined />}
            onClick={
              this.state.matches
                ? this.handleOpenCatalaog
                : this.handleOpenMobileCatalog
            }
          >
            Kataloq
          </Button>
        </Col>

        {/* <Col
          xs={24}
          md={12}
          xl={3}
          style={{ marginLeft: "10px" }}
          className="catalog_button_wrapper"
        >
          {this.props.from === "demands" ? (
            <Select
              showSearch
              placeholder="Qiym??t se??imi"
              allowClear={true}
              style={{ width: 200 }}
              filterOption={false}
              onClear={this.handleClearPrices}
              onSelect={this.handleAllPrice}
              onFocus={this.getAllPrices}
              notFoundContent={Null_Content}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={selectAllPrices}
            />
          ) : (
            ""
          )}
        </Col> */}
      </Row>
    );

    return (
      <div>
        {/* <Sound
          url={bc}
          playStatus={
            this.state.playstatus ? Sound.status.PLAYING : Sound.status.Stopped
          }
          onFinishedPlaying={this.stopPlay}
        /> */}

        {this.state.matches && (
          <CreateProductAndProductGroup
            className="desktopCatalog"
            visible={this.state.visibleCatalog}
            closeCtalaog={this.handleCloseCatalog}
            closeCtalaogGancel={this.handleCloseCatalogGancel}
          />
        )}
        {!this.state.matches && (
          <SelectProductCatalog
            from={this.props.from}
            className="mobileCatalog"
            visible={this.state.visibleCatalog}
            closeCtalaog={this.handleCloseCatalog}
            closeCtalaogGancel={this.handleCloseCatalogGancel}
          />
        )}
        <CreateProductModal
          attrInputs={inputsNameArray}
          visible={this.state.showDrawerProduct}
          childrenDrawer={this.state.showDrawerProductGroup}
          onClose={this.onClose}
          showChildrenDrawer={this.showChildrenDrawer}
          onChildrenDrawerClose={this.onChildrenDrawerClose}
        />
        {PositionArray(dataSource)}

        {dataSource.map((d) => {
          sumtotalprices += parseFloat(d.TotalPrice);
          sumcount += parseFloat(
            d.ShowPacket ? d.ChangePackQuantity : d.Quantity
          );
        })}

        <Tab
          className="custom_table_wrapper_tab"
          onTabChange={this.handleTabChange}
          panes={panes}
        />

        <div className="customContainer">
          <Row>
            <Col xs={24} md={12} xl={9}>
              <Form.Item name="description">
                <TextArea
                  placeholder={"????rh..."}
                  defaultValue={
                    this.props.doc ? this.props.doc.Description : ""
                  }
                  onChange={this.handleDes}
                  rows={3}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={12}>
              <div
                className="doc_info_wrapper"
                style={{ width: "max-content", float: "right" }}
              >
                {this.props.from === "enters" ||
                this.props.from === "losses" ||
                this.props.from === "moves" ||
                this.props.from === "supplies" ||
                this.props.from === "supplyreturns" ||
                this.props.from === "demandreturns" ? (
                  <div>
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text total"
                      title=""
                      value={ConvertFixedTable(sumtotalprices)}
                      prefix={"Yekun m??bl????: "}
                      suffix={"???"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(sumcount)}
                      prefix={"Miqdar: "}
                      suffix={"??d"}
                    />
                  </div>
                ) : this.props.from === "sales" ? (
                  <div>
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(
                        (100 * sumtotalprices) / (100 - this.props.doc.Discount)
                      )}
                      prefix={"??mumi m??bl????: "}
                      suffix={"???"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(this.props.doc.Discount)}
                      prefix={"Endirim: "}
                      suffix={"%"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text total"
                      title=""
                      value={ConvertFixedTable(sumtotalprices)}
                      prefix={"Yekun m??bl????: "}
                      suffix={"???"}
                    />

                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(
                        this.props.additionalInfo.AllSum
                      )}
                      prefix={"N????d: "}
                      suffix={"???"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(
                        this.props.additionalInfo.BankSum
                      )}
                      prefix={"N????dsiz: "}
                      suffix={"???"}
                    />

                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(
                        this.props.additionalInfo.BonusSum
                      )}
                      prefix={"Bonus: "}
                      suffix={"???"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(this.props.doc.Credit)}
                      prefix={"Borca: "}
                      suffix={"???"}
                    />
                    <Divider style={{ backgroundColor: "grey" }} />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(sumcount)}
                      prefix={"Miqdar: "}
                      suffix={"??d"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity "
                      title=""
                      value={ConvertFixedTable(
                        isNaN(sumtotalprices - this.props.doc.Profit)
                          ? "0.00"
                          : sumtotalprices - this.props.doc.Profit
                      )}
                      prefix={"Mayas??: "}
                      suffix={"???"}
                    />

                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(this.props.doc.Profit)}
                      prefix={"Qazanc: "}
                      suffix={"???"}
                    />
                  </div>
                ) : (
                  <div>
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text total"
                      title=""
                      value={ConvertFixedTable(sumtotalprices)}
                      prefix={"Yekun: "}
                      suffix={"???"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(sumcount)}
                      prefix={"Miqdar: "}
                      suffix={"??d"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity "
                      title=""
                      value={ConvertFixedTable(
                        isNaN(sumtotalprices - this.props.doc.Profit)
                          ? "0.00"
                          : sumtotalprices - this.props.doc.Profit
                      )}
                      prefix={"Mayas??: "}
                      suffix={"???"}
                    />
                    <Statistic
                      groupSeparator=" "
                      className="doc_info_text doc_info_secondary quantity"
                      title=""
                      value={ConvertFixedTable(this.props.doc.Profit)}
                      prefix={"Qazanc: "}
                      suffix={"???"}
                    />
                  </div>
                )}

                <Divider style={{ backgroundColor: "grey" }} />
                {this.props.from === "enters" ||
                this.props.from === "supplies" ? (
                  <div style={{ marginTop: "20px" }}>
                    <Form.Item
                      className="comsumption_input_wrapper"
                      label="??lav?? x??rc"
                      name="consumption"
                    >
                      <Input
                        onFocus={this.handleFocus}
                        defaultValue={
                          this.props.doc ? this.props.doc.Consumption : ""
                        }
                        onChange={this.onChangeConsumption}
                        onBlur={(e) => this.handlePutConsumption()}
                        type="number"
                        step="any"
                      />
                    </Form.Item>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  putAddedPoisitons,
  clearDoc,
  updatePositions,
  updateUpperheader,
  updateSelectedRows,
  getLinks,
  getProductsGroupModal,
  updateSelectProductMultiConfirm,
  deleteResponseService,
  putLocalStates,
  fetchAttributes,
  fetchPrices,
  updateChanged,
  putConsumption,
  changeForm,
};
export default connect(mapStateToProps, mapDispatchToProps)(DocTable);
