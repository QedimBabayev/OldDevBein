import React, {Component} from 'react';
import LoaderHOC from './LoaderHOC';
import {SyncOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import putData from '../actions/putAactions/putData-action';
import {Link, Redirect} from 'react-router-dom';
import {fetchData} from '../actions/getData-action';
import DocTable from './DocTable';
import Trans from '../usetranslation/Trans';
import {Col, Row, Collapse} from 'antd';
import MobileDrawer from './MobileDrawer';
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames';
import DocButtons from '../components/DocButtons';
import {delData} from '../actions/delActions/delData-action';
import {updateCustomerSelect} from '../actions/getCustomerGroups-action';
import {getGroups} from '../actions/getGroups-action';
import {openModal} from '../actions/updateStates-action';
import moment from 'moment';
import {updateUpperheader} from '../actions/getNavbar-action';
import LoaderDocHOC from './LoaderDocHOC';
import {Offline, Online} from 'react-detect-offline';
import DemandFormComponent from './DemandFormComponent';
import './ButtonsWrapper.css';
import './DocForm.css';

import {Icon} from 'semantic-ui-react';
import {
  PrinterOutlined,
  UserAddOutlined,
  DeleteOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import {
  Form,
  Input,
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
} from 'antd';
const {Option} = Select;

class CreateDemandForm extends Component {
  formRef = React.createRef ();
  constructor (props) {
    super (props);
  }
  state = {
    doc: '',
    status: false,
    errorFields: [],
    childrenDrawer: false,
  };
  componentDidMount () {
    this.props.updateCustomerSelect ('');
  }

  deleteDoc = (id, e) => {
    e.stopPropagation ();
    var grFilter = {};
    this.props.delData ('demands', grFilter, id);
  };

  onFinishFailed = values => {
    this.setState ({
      errorFields: values.errorFields,
    });
  };
  handleStatusSelect = (checked, event) => {
    this.setState ({
      status: checked,
    });
  };

  handlePageCheck = () => {
    this.props.updateUpperheader (this.props.state.navbar.activeSubItem, '');
  };

  render () {
    if (this.props.state.putdatas.redirectDelete === true) {
      return <Redirect push to="/p=demand" />;
    }
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Button
            icon={<DeleteOutlined />}
            onClick={e =>
              this.deleteDoc (
                this.props.id != ''
                  ? this.props.id
                  : this.props.state.savedoc.newDocId === ''
                      ? ''
                      : this.props.state.savedoc.newDocId,
                e
              )}
            className="align_center del"
            disabled={
              this.props.id === ''
                ? this.props.state.savedoc.newDocId === '' ? true : false
                : false
            }
          >
            S??n??di sili
          </Button>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
    const check = (
      <Menu>
        <Menu.Item key="0">
          <Link
            to={{
              pathname: '/invoice',
              search: `${this.props.id}`,
              hash: 'demands',
            }}
            onClick={this.handlePageCheck}
            target={'_blank'}
          >
            A4
          </Link>

        </Menu.Item>
        <Menu.Item key="1">
          <Button className="flex_directon_col_center">
            50 mm
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Link
            to={{
              pathname: '/check80',
              search: `${this.props.id}`,
              hash: 'demands',
            }}
            onClick={this.handlePageCheck}
            target={'_blank'}
          >
            80mm{' '}
          </Link>

        </Menu.Item>
      </Menu>
    );

    const {errorFields} = this.state;
    return (
      <div className="table_holder">

        <MobileDrawer
          docbuttons={
            <DocButtons
              errorFields={errorFields}
              from={this.props.fromdoc ? this.props.fromdoc : 'p=demand'}
              linkedDocs={this.props.id ? false : true}
              doc={this.props.state.datas.doc}
              toDoc="/createPaymentIn"
              toLinked="/createDemandReturn"
              fromDoc={this.props.url}
              buttonsName={buttonsNames}
              activeitem={this.props.state.navbar.activeItem}
              activesubitem={this.props.state.navbar.activeSubItem}
            />
          }
          printbuttons={
            <Dropdown
              disabled={
                this.props.id === ''
                  ? this.props.state.savedoc.newDocId === '' ? true : false
                  : false
              }
              overlay={check}
              trigger={['click']}
            >
              <Button className="flex_directon_col_center d-flex-row">
                Qaim??
                <PrinterOutlined />
              </Button>
            </Dropdown>
          }
        />
        <Row className="filter_table_wrapper_row doc">
          <Col className="page_name_wrapper" xs={24} md={24} xl={24}>
            <h2 className="custom_top_margin"><Trans word={'Demands'} /></h2>
          </Col>

          <Col xs={24} md={24} xl={24} className="form_header_wrapper">
            <DocButtons
              errorFields={errorFields}
              from={this.props.fromdoc ? this.props.fromdoc : 'p=demand'}
              linkedDocs={this.props.id ? false : true}
              doc={this.props.state.datas.doc}
              toDoc="/createPaymentIn"
              toLinked="/createDemandReturn"
              fromDoc={this.props.url}
              buttonsName={buttonsNames}
              activeitem={this.props.state.navbar.activeItem}
              activesubitem={this.props.state.navbar.activeSubItem}
            />
            <div className="form_header_right_buttons_wrapper">
              <Dropdown
                className="mobilehidden"
                disabled={
                  this.props.id === ''
                    ? this.props.state.savedoc.newDocId === '' ? true : false
                    : false
                }
                overlay={check}
                trigger={['click']}
              >
                <Button className="flex_directon_col_center d-flex-row">
                  Qaim??
                  <PrinterOutlined />
                </Button>
              </Dropdown>

              <Dropdown overlay={menu} trigger={['click']}>

                <Button
                  className="form_setting_icon_wrapper flex_directon_col_center"
                  onClick={e => e.preventDefault ()}
                >
                  <span className="dots" />
                  <span className="dots" />
                  <span className="dots" />
                </Button>
              </Dropdown>

            </div>

          </Col>

          <DemandFormComponent
            docid={this.props.id ? this.props.state.datas.doc[0].Id : ''}
            datas={this.props.state.groups.groups}
            doc={this.props.id ? this.props.state.datas.doc[0] : ''}
          />
          <Col xs={24} md={24} xl={24}>
            <DocTable
              visible={this.state.visible}
              linkedid={this.props.id ? this.props.state.datas.doc[0].Id : ''}
              from="demands"
              doc={this.props.id ? this.props.state.datas.doc[0] : ''}
              handleProduct={this.props.state.handleProduct.selectedProduct}
              datasource={
                this.props.id ? this.props.state.datas.doc[0].Positions : ''
              }
            />
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
  putData,
  fetchData,
  updateCustomerSelect,
  openModal,
  getGroups,
  delData,
  updateUpperheader,
};
export default connect (mapStateToProps, mapDispatchToProps) (
  LoaderDocHOC (CreateDemandForm, 'fetching')
);
