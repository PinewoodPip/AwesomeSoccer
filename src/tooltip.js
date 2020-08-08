import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export class Tooltip extends React.Component {
  render() {
      return (
        <Tippy content={this.props.content} placement="bottom" duration="0">
          <span>
            {this.props.children}
          </span>
        </Tippy>
      )
  }
}