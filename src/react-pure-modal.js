import React from 'react';
import PropTypes from 'prop-types';
import './react-pure-modal.css';

class PureModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleEsc = this.handleEsc.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.state = {
      isOpen: props.isOpen || false,
      level: 1,
    };
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.setModalContext();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.isOpen === 'boolean' && this.props.isOpen !== nextProps.isOpen) {
      if (nextProps.isOpen) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  componentWillUnmount() {
    this.unsetModalContext();
  }

  setModalContext() {
    document.addEventListener('keydown', this.handleEsc);
    document.activeElement.blur();
    document.body.classList.add('body-modal-fix');
  }

  handleEsc(event) {
    if (this.state.level < this.props.level) {
      this.setState({ level: ++this.state.level });
      return false;
    }
    if (typeof document.activeElement.value === 'undefined' && event.keyCode === 27) {
      this.close(event);
    }
  }

  unsetModalContext() {
    document.removeEventListener('keydown', this.handleEsc);
    document.body.classList.remove('body-modal-fix');
    this.setState({ level: 1 });
  }

  open(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
      });
      this.setModalContext();
    }
  }

  close(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.state.isOpen) {
      let isOpen = false;
      if (this.props.onClose && event) {
        isOpen = !this.props.onClose();
      }

      if (this.state.isOpen !== isOpen) {
        this.setState({
          isOpen,
        });
        this.unsetModalContext();
      }
    }
  }

  handleBackdropClick(event) {
    if (event) {
      if (!event.target.classList.contains('pure-modal-backdrop')) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
    }
    this.close(event);
  }

  render() {
    if (!this.state.isOpen) {
      return null;
    }

    const {
      children,
      replace,
      className,
      header,
      footer,
      scrollable,
      width,
    } = this.props;

    let backdropclasses = ['pure-modal-backdrop'];
    let modalclasses = ['pure-modal'];
    let bodyClasses = ['panel-body'];

    if (className) {
      modalclasses = modalclasses.concat(className);
    }

    if (scrollable) {
      bodyClasses = bodyClasses.concat('scrollable');
    } else {
      backdropclasses = backdropclasses.concat('scrollable');
      modalclasses = modalclasses.concat('auto-height');
    }

    const attrs = {};
    if (width) {
      attrs.style = { width };
    }

    return (
      <div
        className={backdropclasses.join(' ')}
        onClick={this.handleBackdropClick}
      >
        <div
          className={modalclasses.join(' ')}
          {...attrs}
        >
          {
            replace ?
            children :
            (
              <div className="panel panel-default">
                <div className="panel-heading">
                  {
                    header &&
                    (
                      <h3 className="panel-title">
                        {header}
                      </h3>
                    )
                  }
                  <div onClick={this.close} className="close">&times;</div>
                </div>
                <div className={bodyClasses.join(' ')}>
                  {children}
                </div>
                {
                  footer &&
                  (
                    <div className="panel-footer">
                      {footer}
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

PureModal.defaultProps = {
  mode: 'modal',
  replace: false,
  scrollable: true,
  level: 1,
};

PureModal.propTypes = {
  mode: PropTypes.oneOf(['modal', 'tooltip']),
  replace: PropTypes.bool,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  scrollable: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  width: PropTypes.string,
  level: PropTypes.number,
  header: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
};

export default PureModal;
