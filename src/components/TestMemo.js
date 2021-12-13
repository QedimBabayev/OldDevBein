import React from "react";
import ProductFolderFunction from "../pages/ProductFolderFunction";
import { connect } from "react-redux";
import { ConvertTree } from "../Function/convert";

function TestMemo({ attributes,groups}) {
  console.log("test memo component re-rendered");
  return (
    <div>
      Test Memo - {JSON.stringify(attributes)}
      <br/>
      <br/>
      Test Groups - {JSON.stringify(groups)}
      <ProductFolderFunction/>
    </div>
  );
}

const mapStateToProps = (state) => ({
  state,
});
export default connect(
  mapStateToProps,
)(React.memo(TestMemo));
