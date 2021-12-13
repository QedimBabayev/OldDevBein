import "antd/dist/antd.css";
import "./App.css";
import { Trans, useTranslation } from "react-i18next";
import Product from "./pages/Product";
import ProductFunction from "./pages/ProductFunction";
import Customer from "./pages/Customer";
import Enter from "./pages/Enter";
import Download from "./pages/Download";
import Settlement from "./pages/Settlements";
import Supply from "./pages/Supply";
import Credit from "./pages/Credit";
import Demand from "./pages/Demand";
import SalePoint from "./pages/SalePoint";
import Loss from "./pages/Loss";
import TaxesPage from "./pages/TaxesPage";
import CreateStock from "./pages/CreateStock";
import Move from "./pages/Move";
import { Result, Button } from "antd";
import Transaction from "./pages/Transaction";
import CreatePaymentOut from "./pages/CreatePaymentOut";
import CreateInvoiceIn from "./pages/CreateInvoiceIn";
import CreateInvoiceOut from "./pages/CreateInvoiceOut";
import CreatePaymentIn from "./pages/CreatePaymentIn";
import bc from "./Check.js/bc";
import Sale from "./pages/Sales";
import check80 from "./Check.js/check80";
import checkPayment from "./Check.js/checkPayment";
import invoice from "./Check.js/invoice";
import EditSale from "./pages/EditSale";
import Cashin from "./pages/Cashins";
import Cashout from "./pages/Cashouts";
import Profile from "./pages/Profile";
import LoginAgain from "./modal/LoginAgain";
import Return from "./pages/Returns";
import DemandReturn from "./pages/DemandReturn";
import SupplyReturn from "./pages/SupplyReturn";
import Login from "./pages/Login";
import StockBalance from "./pages/StockBalance";
import CreateProduct from "./pages/CreateProduct";
import CreateCustomer from "./pages/CreateCustomer";
import CreateEnter from "./pages/CreateEnter";
import CreateSupply from "./pages/CreateSupply";
import CreateDemand from "./pages/CreateDemand";
import CreateDemandReturn from "./pages/CreateDemandReturn";
import CreateSupplyReturn from "./pages/CreateSupplyReturn";
import CreateLoss from "./pages/CreateLoss";
import CreateMove from "./pages/CreateMove";
import Document from "./pages/Document";
import Settings from "./pages/Settings";
import Profit from "./pages/Profit";
import pulse_img from "./images/pulse.png";
import { persistConfig } from "./reducers/rootReducer";
import SaleReport from "./pages/SaleReport";
import Cashes from "./pages/Cashes";
import CreateProductGroup from "./pages/CreateProductGroup";
import CreateCustomerGroup from "./pages/CreateCustomerGroup";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
  Switch,
  useLocation,
} from "react-router-dom";
import Navbar from "./pages/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { updateLanguage } from "./actions/getLang-action";
import { history } from "./helpers/history";
import { Spin, Alert } from "antd";
import CreateTransaction from "./pages/CreateTransaction";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./config/token";
import EditReturn from "./pages/EditReturn";
import { fetchProfile } from "./actions/getProfile-action";
import { Offline, Online } from "react-detect-offline";
import Taxes from "./pages/Taxes";
import Registration from "./pages/Registration";
import { getNotification } from "./actions/notification/notification-action";
import { Tooltip, Drawer, Space, Radio } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { API_BASE, API_LOGIN, API_MODS } from "./config/env";
import axios from "axios";
import DocButtons from "./components/DocButtons";
import IncreaseBalance from "./modal/IncreaseBalance";
import Decline from "./Bank/Decline";
import Cancel from "./Bank/Cancel";
import Approve from "./Bank/Approve";
import { VERSION_NEW, VERSION_LAST } from "./config/env";

function App(props) {
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState("");
  const [balance, setBalance] = useState("");
  const [firstLoad, setFirstLoad] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectLoginAgain, setRedirectLoginAgain] = useState(false);
  const [redirectDefault, setRedirectDefault] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [menuPlus, showMenuPlus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState([]);
  const [placement, setPlacement] = useState("bottom");
  const showDrawer = () => {
    setVisible(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onChangePageMobile = () => {
    setVisible(false);
  };
  const changeLanguage = (language) => {
    props.updateLanguage(language);
    i18n.changeLanguage(language);
  };

  const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    if (Object.keys(caches).length === 0) {
      window.location.reload();
    }
  };
  const location = useLocation();

  useEffect(() => {
    props.updateLanguage("aze");
  }, [])
  useEffect(() => {
   
    if (VERSION_NEW != localStorage.getItem("currentVersion")) {
      clearCacheData();
      localStorage.setItem("currentVersion", VERSION_NEW);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("token") && urlParams.get("login")) {
      localStorage.removeItem("user");
      let user = {};
      if (urlParams.get("token") && urlParams.get("login")) {
        user.Token = urlParams.get("token");
        user.Login = urlParams.get("login");
        localStorage.setItem("user", JSON.stringify(user));
        setRedirect(true);
      }
    } else {
      setToken(
        JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user")).Token
          : ""
      );
      if (props.state.datas.sessionWarning) {
        setRedirectLoginAgain(true);
        return;
      } else if (
        JSON.parse(localStorage.getItem("user")) &&
        !props.state.expired.expired &&
        localStorage.getItem("activePage")
      ) {
        if (performance.navigation.type === 1) {
          console.log("setRedirectLogin", redirectLogin);
          if (redirectLogin) {
            setRedirectLogin(false);
            setRedirect(true);
          } else {
            setRedirect(false);
          }
        } else {
          setRedirect(true);
        }
      } else if (
        JSON.parse(localStorage.getItem("user")) &&
        !props.state.expired.expired &&
        !localStorage.getItem("activePage")
      ) {
        setRedirect(false);
        setRedirectLogin(false);
        setRedirectDefault(true);
      } else {
        setRedirect(false);
        setRedirectLogin(true);
      }
    }

    return () => {};
  }, [JSON.parse(localStorage.getItem("user"))]);

  const MobileButton = (props) => {
    return (
      <div className="mobileButton">
        <Link
          type="primary"
          to={props.page}
          onClick={onChangePageMobile}
          className="mobilebuttonMenus"
        >
          {" "}
          {props.minus ? <MinusOutlined /> : <PlusOutlined />}{" "}
        </Link>
        <span>{props.text}</span>
      </div>
    );
  };

  const BtnPlus = () => {
    return window.location.pathname === "/p=product" ||
      window.location.pathname === "/p=customer" ||
      window.location.pathname === "/p=enter" ||
      window.location.pathname === "/p=loss" ||
      window.location.pathname === "/p=move" ||
      window.location.pathname === "/p=supply" ||
      window.location.pathname === "/p=supplyreturns" ||
      window.location.pathname === "/p=demand" ||
      window.location.pathname === "/p=demandreturns" ||
      window.location.pathname === "/p=transactions" ? (
      <Button
        type="primary"
        onClick={showDrawer}
        className="mobilebutton menu outdoor"
        icon={<img src={pulse_img} />}
      />
    ) : null;
  };

  const PageButtons = () => {
    return (
      <div className="mobilebuttonswrapper">
        {window.location.pathname === "/p=product" ? (
          <>
            <MobileButton page={"/createProducts"} text={"Yeni məhsul"} />
            <MobileButton page={"/createGroup"} text={"Yeni qrup"} />
          </>
        ) : window.location.pathname === "/p=enter" ? (
          <>
            <MobileButton page={"/createEnter"} text={"Yeni daxilolma"} />
          </>
        ) : window.location.pathname === "/p=loss" ? (
          <>
            <MobileButton page={"/createLoss"} text={"Yeni silinmə"} />
          </>
        ) : window.location.pathname === "/p=move" ? (
          <>
            <MobileButton page={"/createMove"} text={"Yeni yerdəyişmə"} />
          </>
        ) : window.location.pathname === "/p=supply" ? (
          <>
            <MobileButton page={"/createSupply"} text={"Yeni alış"} />
          </>
        ) : window.location.pathname === "/p=supplyreturns" ? (
          <>
            <MobileButton page={"/createSupplyReturn"} text={"Qaytarma"} />
          </>
        ) : window.location.pathname === "/p=demand" ? (
          <>
            <MobileButton page={"/createDemand"} text={"Yeni satış"} />
          </>
        ) : window.location.pathname === "/p=demandreturns" ? (
          <>
            <MobileButton page={"/createDemandReturn"} text={"Qaytarma"} />
          </>
        ) : window.location.pathname === "/p=demandreturns" ? (
          <>
            <MobileButton page={"/createDemandReturn"} text={"Qaytarma"} />
          </>
        ) : window.location.pathname === "/p=customer" ? (
          <>
            <MobileButton page={"/createCustomers"} text={"Tərəf-müqabil"} />
            <MobileButton page={"/createCustomerGroup"} text={"Qrup yarat"} />
          </>
        ) : window.location.pathname === "/p=transactions" ? (
          <>
            <MobileButton page={"/createPaymentIn"} text={"Mədaxil nəğd"} />
            <MobileButton page={"/createInvoiceIn"} text={"Mədaxil köçürmə"} />

            <MobileButton
              page={"/createPaymentOut"}
              minus={true}
              text={"Məxaric nəğd"}
            />
            <MobileButton
              page={"/createInvoiceOut"}
              minus={true}
              text={"Məxaric köçürmə"}
            />
          </>
        ) : null}
      </div>
    );
  };

  const DrawerCustom = () => (
    <Drawer
      title={props.state.navbar.activeSubItem}
      placement={placement}
      className="mobileMenuDrawer"
      width={500}
      onClose={onClose}
      visible={visible}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </Space>
      }
    >
      <PageButtons />
    </Drawer>
  );

  // const Pages = (active) => (
  //   <>
  //     {props.state.datas.sessionWarning ? <LoginAgain /> : null}

  //   </>
  // );

  return (
    <div className="mainDiv">
      {redirectLoginAgain ? <LoginAgain /> : null}
      {JSON.parse(localStorage.getItem("user")) ? (
        <Navbar balance={balance} token={token} />
      ) : (
        ""
      )}

      <Switch>
        <Route exact path="/approve" component={Approve} />
        <Route exact path="/decline" component={Decline} />
        <Route exact path="/cancel" component={Cancel} />
        <Route exact path="/p=dashboard" component={Dashboard} />
        <Route exact path="/p=documents" component={Document} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/check80" component={check80} />
        <Route exact path="/checkPayment" component={checkPayment} />
        <Route exact path="/invoice" component={invoice} />
        <Route exact path="/bc" component={bc} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/createStock" component={CreateStock} />
        <Route exact path="/editStock/:id" component={CreateStock} />
        <Route exact path="/p=product" component={Product} />
        <Route exact path="/p=productfunction" component={ProductFunction} />

        <Route exact path="/createProducts/" component={CreateProduct} />
        <Route exact path="/editProduct/:id" component={CreateProduct} />
        <Route exact path="/createGroup" component={CreateProductGroup} />
        <Route exact path="/editGroup/:id" component={CreateProductGroup} />
        <Route exact path="/p=customer" component={Customer} />
        <Route exact path="/createCustomers/" component={CreateCustomer} />
        <Route exact path="/editCustomer/:id" component={CreateCustomer} />
        <Route
          exact
          path="/createCustomerGroup"
          component={CreateCustomerGroup}
        />
        <Route
          exact
          path="/editCustomerGroup/:id"
          component={CreateCustomerGroup}
        />
        <Route path="/p=enter" component={Enter} />
        <Route exact path="/createEnter/" component={CreateEnter} />
        <Route exact path="/editEnter/:id" component={CreateEnter} />
        <Route path="/p=loss" component={Loss} />
        <Route exact path="/createLoss/" component={CreateLoss} />
        <Route exact path="/editLoss/:id" component={CreateLoss} />
        <Route path="/p=move" component={Move} />
        <Route exact path="/createMove/" component={CreateMove} />
        <Route exact path="/editMove/:id" component={CreateMove} />
        <Route path="/p=supply" component={Supply} />
        <Route path="/p=credittransaction" component={Credit} />
        <Route exact path="/createSupply/" component={CreateSupply} />
        <Route exact path="/editSupply/:id" component={CreateSupply} />
        <Route
          path="/p=demand"
          render={() => (
            <Demand
              setting={props.state.settings.setting}
              menu={props.state.navbar.fetching}
            />
          )}
        />
        <Route exact path="/createDemand/" component={CreateDemand} />
        <Route exact path="/editDemand/:id" component={CreateDemand} />
        <Route
          path="/p=demandreturns"
          render={() => (
            <DemandReturn
              setting={props.state.settings.setting}
              menu={props.state.navbar.fetching}
            />
          )}
        />
        <Route
          exact
          path="/createDemandReturn/"
          component={CreateDemandReturn}
        />
        <Route
          exact
          path="/editDemandReturn/:id"
          component={CreateDemandReturn}
        />
        <Route
          path="/p=supplyreturns"
          render={() => (
            <SupplyReturn
              setting={props.state.settings.setting}
              menu={props.state.navbar.fetching}
            />
          )}
        />
        <Route
          exact
          path="/createSupplyReturn/"
          component={CreateSupplyReturn}
        />
        <Route
          exact
          path="/editSupplyReturn/:id"
          component={CreateSupplyReturn}
        />
        <Route exact path="/createPaymentOut/" component={CreatePaymentOut} />
        <Route exact path="/createInvoiceOut/" component={CreateInvoiceOut} />
        <Route exact path="/editPaymentOut/:id" component={CreatePaymentOut} />
        <Route exact path="/editInvoiceOut/:id" component={CreateInvoiceOut} />
        <Route exact path="/createPaymentIn/" component={CreatePaymentIn} />
        <Route exact path="/editPaymentIn/:id" component={CreatePaymentIn} />
        <Route exact path="/createInvoiceIn/" component={CreateInvoiceIn} />
        <Route exact path="/editInvoiceIn/:id" component={CreateInvoiceIn} />
        <Route path="/p=settlements" component={Settlement} />
        <Route path="/p=salereports" component={SaleReport} />
        <Route path="/p=sales" component={Sale} />
        <Route exact path="/editSale/:id" component={EditSale} />
        <Route path="/p=returns" component={Return} />
        <Route exact path="/editReturn/:id" component={EditReturn} />
        <Route path="/p=cashins" component={Cashin} />
        <Route path="/taxes" component={Taxes} />
        <Route path="/p=cashouts" component={Cashout} />
        <Route path="/p=stockbalance" component={StockBalance} />
        <Route path="/p=transactions" component={Transaction} />
        <Route exact path="/createTransaction/" component={CreateTransaction} />
        <Route
          exact
          path="/editTransaction/:id"
          component={CreateTransaction}
        />
        <Route path="/p=salepoints" component={SalePoint} />
        <Route path="/p=profit" component={Profit} />
        <Route path="/p=cashes" component={Cashes} />
        <Route path="/p=download" component={Download} />
        <Route exact path="/beinlogin" component={Login} />
        <Route exact path="/registration" component={Registration} />
      </Switch>
      <BtnPlus />
      <DrawerCustom />
      {props.state.checkPage.show ? (
        ""
      ) : redirect ? (
        <Redirect exact to={`/${localStorage.getItem("activePage")}`} />
      ) : redirectLogin ? (
        <Redirect to="/beinlogin" />
      ) : redirectDefault ? (
        <Redirect exact to={"/p=dashboard"} />
      ) : (
        ""
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  updateLanguage,
  getNotification,
  fetchProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
