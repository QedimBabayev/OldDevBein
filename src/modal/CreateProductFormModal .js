import React, {Component} from 'react';
import {SyncOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Tab} from 'semantic-ui-react';
import {Col, Row, Collapse, message} from 'antd';
import {getBarcode, deleteBarcode} from '../actions/getBarcode-action';
import putData from '../actions/putAactions/putData-action';
import {fetchData} from '../actions/getData-action';
import {fetchRefList} from '../actions/getAttributes-action';
import DocButtons from '../components/DocButtons';
import {updateSelectProductMultiConfirm} from '../actions/updateStates-action';
import updateChanged from '../actions/updateChanged-action';
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames';
import {getGroups} from '../actions/getGroups-action';
import {newProductGroup} from '../actions/modalActions/putModalInputs-action';
import {
  getProductsGroupModal,
  productModalFilter,
} from '../actions/modalActions/getCustomerGroupsModal-action';
import {
  openProductGroupModal,
  updateStatesCreate,
} from '../actions/updateStates-action';
import PercentShow from '../components/PercentShow';
import {getToken} from '../config/token';
import CreateProductGroupFormModal from './CreateProductGroupFormModal';
import {
  putDataProduct,
  progress,
} from '../actions/modalActions/putModalInputs-action';
import {putLocalStates} from '../actions/modalActions/putModalInputs-action';
import ModalHOC from './ModalrHOC';
import {API_BASE} from '../config/env';
import {List} from 'semantic-ui-react';
import axios from 'axios';
import Trans from '../usetranslation/Trans';
import BootstrapTable from 'react-bootstrap-table-next';
import '../components/Form.css';
import '../components/Colors.css';
import '../components/ButtonsWrapper.css';
import {PrinterOutlined, PlusOutlined} from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  InputNumber,
  TreeSelect,
  Checkbox,
  Alert,
  Dropdown,
  Select,
  Spin,
  Menu,
} from 'antd';

const {Option} = Select;
const {TextArea} = Input;
const {Panel} = Collapse;

var customCascader = [];
var newArr = [];
var lowerCaseForAttributesSelect = [];
var editProduct;
var ownersOptions = [];
var depOptions = [];
var errorFieldsDynamic = [];
var pid;
var suffixed;
var lowercasearr;
function convert (array) {
  var map = {};
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    if (!(obj.id in map)) {
      map[obj.id] = obj;
      map[obj.id].children = [];
    }

    if (typeof map[obj.id].name == 'undefined') {
      map[obj.id].id = obj.id;
      map[obj.id].name = obj.name;
      map[obj.id].parent = obj.parent;
      map[obj.id].value = obj.value;
      map[obj.id].label = obj.label;
    }

    var parent = obj.parent || '-';
    if (!(parent in map)) {
      map[parent] = {};
      map[parent].children = [];
    }

    map[parent].children.push (map[obj.id]);
  }
  return map['-'];
}

function CalcPercent (percent) {
  return percent;
}

var panes;
var sendObject = {};
var oneRefArray = [];

class CreateProductForm extends Component {
  formRef = React.createRef ();
  constructor (props) {
    super (props);
    this.state = {
      productid: this.props.selectedProduct
        ? this.props.selectedProduct.Id
        : '',
      weight: false,
      archieve: false,
      barcodeClicked: false,
      visibleMenuSettings: false,
      defaultpercent: 0,
      ownername: '',
      departmentname: '',
      lowercase: [],
      loadRoleSelects: true,
      groupId: '',
      selectedGroupId: '',
      groupName: '',
      errorFields: [],
      errorStateMessages: [],
      loadingTab: true,
      attrRequired: false,
      oneRefList: [],
      sendProObject: {},
      focusedModSelect: false,
      isPacket: this.props.selectedProduct
        ? this.props.selectedProduct.IsPack
        : 0,
    };
  }
  showChildrenModal = () => {
    this.props.openProductGroupModal (true);
  };

  componentWillReceiveProps (nextProps) {
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
      this.formRef.current.setFieldsValue ({
        price: newPrice,
      });
    }
    if (
      nextProps.selectedProduct &&
      nextProps.selectedProduct.Id !== this.state.productid
    ) {
      this.setState ({
        productid: nextProps.selectedProduct.Id,
      });
    }

    if (
      nextProps.state.docmodals.newGroupId &&
      nextProps.state.docmodals.newGroupId != this.state.groupId
    ) {
      this.setState (
        {
          groupId: nextProps.state.docmodals.newGroupId,
          selectedGroupId: '',
          groupName: nextProps.state.docmodals.newGroup,
        },
        () => {
          this.formRef.current.setFieldsValue ({
            groupid: nextProps.state.docmodals.newGroup,
          });
        }
      );
    }
  }

  onGetBarcode = () => {
    this.props.getBarcode (this.state.weight);
    this.props.updateChanged ('true', 'p=products');
  };
  componentDidMount () {
    this.onGetBarcode ();
    this.props.newProductGroup ('', '');
  }
  handleTabChange = (event, data) => {
    if (data.activeIndex === 1) {
      setTimeout (() => {
        this.setState ({
          loadingTab: false,
        });
      }, 1000);
    } else {
      this.setState ({
        loadingTab: true,
      });
    }
  };

  getProGroups = () => {
    newArr = [];
    productModalFilter.id = '';
    productModalFilter.gp = '';
    productModalFilter.token = getToken ();
    this.props.getProductsGroupModal (productModalFilter);
  };
  onValuesChange = (changedValues, allValues) => {
    var newPercent = parseFloat (
      parseFloat (allValues.price - allValues.buyprice).toFixed (2) *
        parseFloat (100) /
        parseFloat (allValues.buyprice).toFixed (2)
    ).toFixed (2);
    this.setState ({
      defaultpercent: newPercent,
      buypricechange: allValues.buyprice,
    });
  };
  onChangeSelectItem = (e, name) => {
    var changedvalue = {[name]: e};
    this.setState ({
      sendProObject: Object.assign (this.state.sendProObject, changedvalue),
      status: false,
      isArchFunc: false,
    });
    this.props.updateChanged ('true', 'p=products');
  };

  onFinishFailed = values => {
    this.setState ({
      errorFields: values.errorFields,
      errorStateMessages: [],
    });
  };
  onChange = val => {
    this.setState ({
      selectedGroupId: val,
      groupId: '',
    });
  };

  onFinish = values => {
    var sendProduct = {};
    var prices = [];
    var reqErrors = [];
    var reqattr = false;
    errorFieldsDynamic = [];
    sendProduct = values;
    sendProduct.token = JSON.parse (localStorage.getItem ('user'))
      ? JSON.parse (localStorage.getItem ('user')).Token
      : '';
    progress (true);
    this.state.isPacket === 1
      ? (sendProduct.ispack = 1)
      : (sendProduct.ispack = 0);
    this.state.newProductId != ''
      ? (sendProduct.id = this.state.newProductId)
      : (sendProduct.id = values.id);
    this.state.archieve
      ? (sendProduct.isarch = true)
      : (sendProduct.isarch = false);
    delete sendProduct['weight'];

    if (this.state.selectedGroupId != '') {
      delete sendProduct['groupid'];
      sendProduct.groupid = this.state.selectedGroupId;
    }
    if (this.state.groupId != '') {
      delete sendProduct['groupid'];
      sendProduct.groupid = this.state.groupId;
    }

    Object.entries (sendProduct).map (([k, v]) => {
      if (k.indexOf ('PriceType_') != -1) {
        if (v) {
          prices.push ({
            PriceType: k.slice (k.indexOf ('_') + 1),
            Price: v,
          });
        }
      }
    });
    var totalFilter = Object.assign (sendProduct, this.state.sendProObject);
    console.log('totalfilter',totalFilter)
    Object.values (this.props.attrInputs).map (atr => {
      if (atr.isrequired === 1) {
        if (
          Object.entries (totalFilter).findIndex(([k, v]) => k === atr.name) === -1 || !Object.entries (totalFilter).find (([k, v]) => k === atr.name)[1]
        )
         {
          reqattr = true;
          reqErrors.push (atr.label);
        }
      }
    });

    sendProduct.isweight = this.state.weight;

    reqErrors.forEach (error => {
      errorFieldsDynamic.push (`Zəhmət olmassa, ${error} xanasını doldurun`);
    });
    this.setState ({
      errorStateMessages: errorFieldsDynamic,
    });

    if (reqErrors.length === 0) {
      this.props.putDataProduct (sendProduct);
    } else {
      progress (
        false,
        1,
        'Parametrlər bölməsində vacib xanaları doldurun',
        this.state.archieve ? 'archieve' : 'archievegancel',
        'save'
      );
      this.setState ({
        loadingButton: false,
      });
    }
  };

  handleSetPacket = event => {
    var ispack = event.target.checked ? 1 : 0;
    this.setState ({
      isPacket: ispack,
    });
  };
  handleBarcodeSelect = event => {
    this.setState (
      {
        weight: event.target.checked,
      },
      () => this.onGetBarcode ()
    );
  };
  clearRefList = () => {
    this.setState ({
      oneRefList: [],
      focusedModSelect: false,
    });
  };
  getRefList = e => {
    window.scrollTo (0, 0);
    oneRefArray = [];
    this.setState ({
      oneRefList: [],
      focusedModSelect: true,
    });
    var getOneFilter = {};
    getOneFilter.token = JSON.parse (localStorage.getItem ('user'))
      ? JSON.parse (localStorage.getItem ('user')).Token
      : '';
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
  handleFocus = event => event.target.select ();
  handleVisibleChange = flag => {
    this.setState ({visibleMenuSettings: flag});
  };
  onChangeItem = (e, name) => {
    var changedvalue = {[name]: e.target.value};
    this.setState ({
      sendProObject: Object.assign (this.state.sendProObject, changedvalue),
      status: false,
      isArchFunc: false,
    });
    this.props.updateChanged ('true', 'p=products');
  };
  async getOneRefList (object) {
    const res = await axios.post (
      `${API_BASE}/attributes/getreflist.php`,
      object
    );
    return await res;
  }

  render () {
    newArr = [];
    customCascader = [];
    lowerCaseForAttributesSelect = [];
    Object.values (this.props.state.attributes.reflist).map (r => {
      lowerCaseForAttributesSelect.push ({
        label: r.Name,
        value: r.Id,
      });
    });
    Object.values (this.props.state.docmodals.productGroups).map (d => {
      d.ParentId === '00000000-0000-0000-0000-000000000000'
        ? (pid = '')
        : (pid = d.ParentId);
      customCascader.push ({
        id: d.Id,
        name: d.Name,
        parent: pid,
        value: d.Id,
        label: d.Name,
      });
    });
    newArr = convert (customCascader);

    Object.values (this.props.state.owdep.owners).map (r => {
      ownersOptions.push ({
        label: r.Name,
        value: r.Id,
      });
    });

    Object.values (this.props.state.owdep.departments).map (r => {
      depOptions.push ({
        label: r.Name,
        value: r.Id,
      });
    });
    const modInputs = this.props.attrInputs
      .filter (a => a.referencetypeid === '')
      .map (a => (
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

          <Input allowClear />

        </Form.Item>
      ));
    const modSelects = this.props.attrInputs
      .filter (a => a.referencetypeid != '')
      .map (a => (
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
            autoFocus={true}
            style={{width: 200}}
            id={a.referencetypeid}
            placeholder=""
            onFocus={this.getRefList}
            onBlur={this.clearRefList}
            onChange={e => this.onChangeSelectItem (e, `${a.name}`)}
            filterOption={(input, option) =>
              option.label.toLowerCase ().indexOf (input.toLowerCase ()) >= 0}
            notFoundContent={<Spin size="small" />}
            loading={this.props.state.attributes.refLoading}
            options={
              this.props.state.attributes.refLoading === false &&
                !this.state.focusedModSelect
                ? lowerCaseForAttributesSelect
                : this.state.focusedModSelect ? this.state.oneRefList : ''
            }
          />

        </Form.Item>
      ));

    panes = [
      {
        menuItem: 'Qiymət',
        render: () => (
          <Tab.Pane attached={false}>

            <Form.Item label={<Trans word={'BuyPrice'} />} name="buyprice">
              <Input
                type="number"
                onFocus={this.handleFocus}
                addonAfter="₼"
                step="any"
                min={0}
              />
            </Form.Item>

            <h5>Satış qiymətləri</h5>
            <Form.Item label={<Trans word={'Product Price'} />} name="price">
              <Input
                type="number"
                step="any"
                onFocus={this.handleFocus}
                addonAfter="₼"
                min={0}
              />
            </Form.Item>
            <Form.Item label={<Trans word={'MinPrice'} />} name="minprice">
              <Input
                type="number"
                step="any"
                onFocus={this.handleFocus}
                addonAfter="₼"
                min={0}
              />
            </Form.Item>
            {/* <PercentShow buyprice={this.state.buypricechange} defpercent={isNaN(this.state.defaultpercent) ? 0 : isFinite(this.state.defaultpercent) ? this.state.defaultpercent : 0} /> */}

          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Parametrlər',
        render: () => (
          <Tab.Pane loading={this.state.loadingTab} attached={false}>
            {modInputs}
            {modSelects}

          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Anbar qalığı',
        render: () => <Tab.Pane attached={false} />,
      },
      {
        menuItem: 'Tarix',
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
      },
    ];
    var errorKeys = 0;
    const errorMessages = (
      <List as="ul">
        {Array.isArray (this.state.errorStateMessages)
          ? this.state.errorStateMessages.map (m => (
              <List.Item key={errorKeys++} as="li">{m}</List.Item>
            ))
          : ''}

      </List>
    );

    return (
      <div className="table_holder">
        <Row>

          <Col xs={24} md={24} xl={24}>
            <Form
              className="docModal"
              id="docModal"
              ref={this.formRef}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 14,
              }}
              name="basic"
              layout="horizontal"
              onFinish={this.onFinish}
              onValuesChange={this.onValuesChange}
              onFinishFailed={this.onFinishFailed}
            >

              <Row className="main_form_side">
                <Col xs={24} md={9} xl={8} className="left_form_wrapper">
                  <Alert
                    message={errorMessages}
                    type="error"
                    style={{
                      marginBottom: '15px',
                      display: this.state.errorStateMessages.length > 0
                        ? 'block'
                        : 'none',
                    }}
                    showIcon
                  />

                  <div
                    className="ant-row ant-form-item"
                    style={{marginBottom: '2.5rem'}}
                  >
                    <div class="ant-col ant-col-7 ant-form-item-label">
                      <h2>Ümumi məlumatlar</h2>
                    </div>
                    <div class="ant-col ant-col-12 ant-form-item-label">
                      <h2 />
                    </div>
                  </div>
                  <Form.Item
                    label={<Trans word={'Product Name'} />}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Zəhmət olmasa, məhsulun adını qeyd edin..',
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>

                  <Form.Item label={<Trans word={'BarCode'} />} name="barcode">
                    <Input
                      suffix={
                        <SyncOutlined
                          className={'suffixed'}
                          onClick={this.onGetBarcode}
                        />
                      }
                    />
                  </Form.Item>

                  <Form.Item label={<Trans word={'ArtCode'} />} name="artcode">
                    <Input />
                  </Form.Item>
                  <Form.Item hidden={true} label="id" name="id">
                    <Input />
                  </Form.Item>

                  <div className="form_item_with_icon_modal">
                    <Form.Item
                      label={<Trans word={'Product GroupName'} />}
                      name="groupid"
                      className="group_item_wrapper"
                      rules={[
                        {
                          required: true,
                          message: 'Zəhmət olmasa, məhsulun qrupunu qeyd edin..',
                        },
                      ]}
                    >
                      <TreeSelect
                        allowClear
                        onFocus={this.getProGroups}
                        onChange={this.onChange}
                        notFoundContent={<Spin size="small" />}
                        treeData={newArr ? newArr.children : []}
                      />

                    </Form.Item>
                    <PlusOutlined
                      className="add_elements_modal"
                      onClick={this.props.openSecondModal}
                    />
                  </div>

                  <Form.Item
                    label={<Trans word={'Cost Price'} />}
                    hidden={this.state.productid != '' ? false : true}
                  >
                    <InputNumber disabled={true} />
                  </Form.Item>

                  <Collapse ghost>
                    <Panel header="Əlavə parametr" key="1">
                      <Collapse>
                        <Panel header="Paket (qutu)" key="1">

                          <Form.Item
                            label={'Paketli məhsul'}
                            valuePropName="checked"
                          >
                            <Checkbox
                              checked={this.state.isPacket === 1 ? true : false}
                              disabled={
                                this.props.selectedProduct ? true : false
                              }
                              onChange={this.handleSetPacket}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Satış qiyməti"
                            name="packprice"
                            onBlur={e => this.onChangeItem (e, 'packprice')}
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
                            onBlur={e => this.onChangeItem (e, 'packquantity')}
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

                  <Form.Item
                    name="description"
                    label={<Trans word={'Description'} />}
                  >
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item
                    label={<Trans word={'Weight'} />}
                    name="weight"
                    valuePropName="checked"
                  >
                    <Checkbox onChange={this.handleBarcodeSelect} name="wt" />
                  </Form.Item>

                  {/* <Form.Item label="">
                                        <Button htmlType="submit" className='customsavebtn'>Yadda saxla</Button>
                                    </Form.Item>  */}

                </Col>
                <Col
                  xs={24}
                  md={12}
                  xl={this.props.state.stateChanges.openCreateModal ? 24 : 15}
                >
                  <div className="tab_wrapper">
                    <Tab
                      menu={{attached: false}}
                      onTabChange={this.handleTabChange}
                      panes={panes}
                    />
                  </div>

                </Col>
              </Row>
            </Form>
          </Col>

        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state,
});
const mapDispatchToProps = {
  getBarcode,
  putData,
  updateSelectProductMultiConfirm,
  fetchData,
  fetchRefList,
  updateChanged,
  deleteBarcode,
  getGroups,
  openProductGroupModal,
  updateStatesCreate,
  putDataProduct,
  putLocalStates,
  getProductsGroupModal,
  newProductGroup,
};

export default connect (mapStateToProps, mapDispatchToProps) (
  CreateProductForm
);
