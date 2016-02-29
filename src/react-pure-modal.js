import React, { Component, PropTypes } from 'react';
import keymage from 'keymage';
import uniqueId from 'lodash/uniqueId';
import './react-pure-modal.css';

class SmartModal extends Component {
  constructor(props) {
    super(props);
    this.isOpen = false;
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.scope = uniqueId('modal-');
  }

  componentDidMount() {
    keymage(this.scope, 'esc', this.close);

    if (this.props.isOpen) {
      this.setModalContext();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.isOpen = nextProps.isOpen;
  }

  componentWillUpdate() {
    if (this.isOpen) {
      if (this.props.isOpen !== this.isOpen) {
        this.setModalContext();
      }
    } else {
      this.unsetModalContext();
    }
  }

  componentWillUnmount() {
    keymage.unbind(this.scope, 'esc', this.close);
    this.unsetModalContext();
  }

  setModalContext() {
    document.body.classList.add('body-modal-fix');
    keymage.pushScope(this.scope);
  }

  unsetModalContext() {
    document.body.classList.remove('body-modal-fix');
    keymage.popScope();
  }

  open(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!this.isOpen) {
      this.isOpen = true;
      this.forceUpdate();
    }
  }

  close(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.isOpen) {
      if (this.props.onClose) {
        this.isOpen = !this.props.onClose();
      } else {
        this.isOpen = false;
      }
      this.forceUpdate();
    }
  }

  handleBackdropClick(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (!event.target.classList.contains('modal-backdrop')) {
        return;
      }
    }
    this.close();
  }

  render() {
    if (!this.isOpen) {
      return null;
    }

    const { children, replace, className, header, footer } = this.props;

    return (
      <div className="modal-backdrop" onClick={this.handleBackdropClick}>
        <div className={`smart-modal ${ className }`}>
          {
            replace ?
            children :
            <div className="panel panel-default">
              <div className="panel-heading">
                {header}
                <div onClick={this.close} className="close">&times;</div>
              </div>
              <div className="panel-body" scrollable>
                {children}
              </div>
              {
                footer &&
                <div className="panel-footer" ref="footer">
                  {footer}
                </div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

SmartModal.defaultProps = {
  mode: 'modal',
  replace: false,
};

SmartModal.propTypes = {
  mode: PropTypes.oneOf(['modal', 'tooltip']),
  replace: PropTypes.bool,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  header: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
};

export default SmartModal;