import React, { Component } from 'react'
import { connect } from 'react-redux'
import TemplatesPage from './TemplatesPage'
import ModalHOC from '../modal/ModalrHOC'
class Templates extends Component {

    render() {
        return (
            <div>
                <TemplatesPage />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalHOC(Templates, 'fetching'))

