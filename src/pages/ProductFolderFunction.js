import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { getGroups } from "../actions/getGroups-action";
import { Tree } from "antd";
const { DirectoryTree } = Tree;
const treeData = [
  {
    title: "parent 0",
    key: "0-0",
    children: [
      {
        title: "leaf 0-0",
        key: "0-0-0",
        isLeaf: true,
      },
      {
        title: "leaf 0-1",
        key: "0-0-1",
        isLeaf: true,
      },
    ],
  },
  {
    title: "parent 1",
    key: "0-1",
    children: [
      {
        title: "leaf 1-0",
        key: "0-1-0",
        isLeaf: true,
      },
      {
        title: "leaf 1-1",
        key: "0-1-1",
        isLeaf: true,
      },
    ],
  },
];

const ProductFolderFunction = ({groups}) => {
  console.log("ProductFolderFunction 6 component re-rendered");
  const onSelect = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand = () => {
    console.log("Trigger Expand");
  };

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={treeData}
    />
  );
};

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  getGroups,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ProductFolderFunction));
