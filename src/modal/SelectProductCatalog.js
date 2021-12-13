import React, { useState } from "react";
import { Modal, Button } from "antd";
import { connect } from "react-redux";
import { getGroups } from "../actions/getGroups-action";
import { docFilter } from "../config/filter";
import ProductForDoc from "./ProductForDoc";
import { updateStatesCreate } from "../actions/updateStates-action";
import { fetchAttributes } from "../actions/getAttributes-action";
import ProductListForMobile from "./ProductListForMobile";
import Trans from "../usetranslation/Trans";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  openModal,
  openProductGroupModal,
  updateSelectProductMultiConfirm,
} from "../actions/updateStates-action";
import "./modal.css";
import "./selectCatalog.css";

const SelectProductCatalog = (props) => {
  return (
    <div>
      <Modal
        title={<Trans word={"Products"} />}
        visible={props.visible}
        closable={true}
        className="mobile_catalog_modal"
        onCancel={props.closeCtalaogGancel}
        footer={[
          <Button
            className="buttons_icon back_doc_mobile"
            icon={<ArrowLeftOutlined />}
            key="back"
            onClick={props.closeCtalaog}
          >
            Sənədə əlavə et
          </Button>,
        ]}
      >
        <ProductListForMobile from={props.from} />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  getGroups,
  updateStatesCreate,
  openModal,
  openProductGroupModal,
  updateSelectProductMultiConfirm,
  fetchAttributes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectProductCatalog);
