import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import { getGroups } from "../actions/getGroups-action";
import GridExampleContainer from "./ProductPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Products/buttonsNames";
import { fetchAttributes, fetchRefList } from "../actions/getAttributes-action";
import { docFilter } from "../config/filter";
import { getToken } from "../config/token";
import { getCheckPage } from "../actions/check/check-action";
import { getOwners, getDepartments } from "../actions/getGroups-action";
import { updateProductId } from "../actions/updateProduct";
import ProductFolderFunction from "./ProductFolderFunction";
import TestMemo from "../components/TestMemo";
import "../components/ButtonsWrapper.css";

export const ProductFunction = (props) => {
  console.log("product function render");
  useEffect(() => {
    props.getGroups("productfolders");
  }, []);
  const attrs = useMemo(() => {
    return props.state.attributes.attributes;
  }, [props.state.attributes.attributes]);

  const groups = useMemo(() => {
    return props.state.groups.groups;
  }, [props.state.groups.groups]);

  return (
    <div>
      <TestMemo groups={groups} attributes={attrs} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  fetchData,
  getGroups,
  fetchRefList,
  fetchAttributes,
  getCheckPage,
  getOwners,
  getDepartments,
  updateProductId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ProductFunction));
