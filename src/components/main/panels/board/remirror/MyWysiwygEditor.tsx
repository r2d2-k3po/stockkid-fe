import React, {FC, PropsWithChildren, useCallback} from 'react';
import {PlaceholderExtension, wysiwygPreset} from 'remirror/extensions';
import {TableExtension} from '@remirror/extension-react-tables';
import {
  EditorComponent,
  Remirror,
  TableComponents,
  ThemeProvider,
  useRemirror
} from '@remirror/react';
import {AllStyledComponent} from '@remirror/styles/emotion';

import {BubbleMenu} from './BubbleMenu';
import {TopToolbar} from './TopToolbar';
import {ReactEditorProps} from './types';

export type WysiwygEditorProps = Partial<ReactEditorProps>;

export const MyWysiwygEditor: FC<PropsWithChildren<WysiwygEditorProps>> = ({
  placeholder,
  stringHandler,
  children,
  theme,
  ...rest
}) => {
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({placeholder}),
      new TableExtension(),
      ...wysiwygPreset()
    ],
    [placeholder]
  );

  const {manager} = useRemirror({extensions, stringHandler});

  return (
    <AllStyledComponent>
      <ThemeProvider theme={theme}>
        <Remirror manager={manager} {...rest}>
          <TopToolbar />
          <EditorComponent />
          <BubbleMenu />
          <TableComponents />
          {children}
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
};
