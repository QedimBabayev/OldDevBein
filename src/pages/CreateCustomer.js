import React, { Component } from "react";
import { connect } from "react-redux";
import CreateCustomerForm from "../components/CreateCustomerForm";
import { getGroups } from "../actions/getGroups-action";
import { docFilter } from "../config/filter";
import { fetchData } from "../actions/getData-action";
import { getCheckPage } from "../actions/check/check-action";
import { deleteBarcode } from "../actions/getBarcode-action";
import { Skeleton } from "antd";
import { updateProductId } from "../actions/updateProduct";
import { fetchPage } from "../actions/getData-action";
class CreateCustomer extends Component {
  state = {
    update: false,
  };
  componentWillMount() {
    this.props.getGroups("customergroups");
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.deleteBarcode();
    this.props.getCheckPage(false);
    if (match.params.id) {
      docFilter.id = match.params.id;
      this.props.fetchPage("customers");
    }
  }

  render() {
    const { match } = this.props;

    const returnElementId = !this.props.state.datas.fetchingEdit ? (
      <div>
        <CreateCustomerForm
          datas={this.props.state.groups.groups}
          owners={this.props.state.owdep.owners}
          departments={this.props.state.owdep.departments}
          selectedCustomer={this.props.state.datas.doc[0]}
        />
      </div>
    ) : (
      <Skeleton className="doc_loader" active />
    );
    
    const returnElementUpdate = !this.props.state.datas.fetchingEdit ? (
      <div>
        <CreateCustomerForm
          datas={this.props.state.groups.groups}
          owners={this.props.state.owdep.owners}
          departments={this.props.state.owdep.departments}
          selectedCustomer={this.props.state.datas.doc[0]}
        />
      </div>
    ) : (
      <Skeleton className="doc_loader" active />
    );
    const returnElement = (
      <div>
        <CreateCustomerForm
          datas={this.props.state.groups.groups}
          owners={this.props.state.owdep.owners}
          departments={this.props.state.owdep.departments}
          selectedCustomer={this.props.customer}
        />
      </div>
    );

   return match.params.id
     ? returnElementId
     : this.props.state.handleProduct.updated
     ? returnElementUpdate
     : returnElement;
  }
}

const mapStateToProps = (state, props) => ({
  state,
  customer: state.datas.datas.find((p) => p.Id == props.match.params.id),
});
const mapDispatchToProps = {
  getGroups,
  fetchData,
  getCheckPage,
  deleteBarcode,
  updateProductId,
  fetchPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCustomer);
