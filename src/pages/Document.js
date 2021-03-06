import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./DocumentPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Documents/buttonsNames";
import { docFilter } from "../config/filter";
import { setRedirect, isDeleted } from "../actions/delActions/delData-action";
import ok from "../audio/ok.mp3";
import Sound from "react-sound";
import { getOwners, getDepartments } from "../actions/getGroups-action";

class Document extends Component {
  componentDidMount() {
    docFilter.pg = 0;
    docFilter.id = "";
    docFilter.gp = "";
    this.props.getDepartments("departments");
    this.props.getOwners("owners");
    this.props.setRedirect(false);
  }

  render() {
    return (
      <div className="table_holder">
        <ButtonsWrapper
          from={"normal"}
          fetchFast={"documents"}
          buttonsName={buttonsNames}
          activeitem={this.props.state.navbar.activeItem}
          activesubitem={this.props.state.navbar.activeSubItem}
        />
        <GridExampleContainer groups={this.props.state.groups.groups} />
        <Sound
          url={ok}
          playStatus={
            this.props.state.putdatas.isdeleted
              ? Sound.status.PLAYING
              : Sound.status.Stopped
          }
          onFinishedPlaying={this.handleDeleteDoc}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  fetchData,
  getOwners,
  getDepartments,
  setRedirect,
  isDeleted,
};
export default connect(mapStateToProps, mapDispatchToProps)(Document);
