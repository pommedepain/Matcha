import React from "react";

const SvgHeartEmpty = props => (
  <svg width="1em" height="1em" {...props}>
    <defs>
      <font id="heart_empty_svg__heart_empty" horizAdvX={1000}>
        <fontFace
          fontFamily="heart_empty"
          fontWeight={400}
          ascent={850}
          descent={-150}
        />
        <glyph
          glyphName="heart"
          unicode="\uE800"
          d="M508-66q-17 0-29 9-26 17-85 58T240 113 106 223Q0 329 0 487q0 116 82 198t198 82q143 0 228-118 38 55 99 86t129 32q117 0 198-82t81-198q0-158-106-264-38-38-133-110T621 0t-83-57q-13-9-30-9zM280 663q-72 0-124-51t-52-125q0-114 76-190 79-79 328-248 248 169 327 248 76 76 76 190 0 73-51 125t-124 51q-73 0-125-51t-51-125q0-22-16-37t-36-15-37 15-15 37q0 73-52 125t-124 51z"
          horizAdvX={1015}
        />
      </font>
    </defs>
  </svg>
);

export default SvgHeartEmpty;
