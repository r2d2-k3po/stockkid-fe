import React, {
  forwardRef,
  PropsWithChildren,
  Ref,
  useCallback,
  useImperativeHandle
} from 'react';
import {PlaceholderExtension, wysiwygPreset} from 'remirror/extensions';
import {TableExtension} from '@remirror/extension-react-tables';
import {
  EditorComponent,
  Remirror,
  TableComponents,
  ThemeProvider,
  useHelpers,
  useRemirror,
  useRemirrorContext
} from '@remirror/react';
import {AllStyledComponent} from '@remirror/styles/emotion';

import {BubbleMenu} from './BubbleMenu';
import {TopToolbar} from './TopToolbar';
import {ReactEditorProps} from './types';
import {RemirrorContentType} from 'remirror';
import {EditorRef} from '../BoardEditor';

const ImperativeHandle = forwardRef(function ImperativeHandle(
  _: unknown,
  ref: Ref<EditorRef>
) {
  const {clearContent} = useRemirrorContext({
    autoUpdate: true
  });

  const {getText} = useHelpers();

  // Expose content handling to outside
  useImperativeHandle(ref, () => {
    return {clearContent, getText};
  });
  return <></>;
});

export type WysiwygEditorProps = Partial<ReactEditorProps>;

const MyWysiwygEditor = forwardRef<
  EditorRef,
  PropsWithChildren<WysiwygEditorProps>
>(function MyWysiwygEditor(
  {placeholder, stringHandler, children, theme, initialContent, ...rest},
  ref
) {
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({placeholder}),
      new TableExtension(),
      ...wysiwygPreset()
    ],
    [placeholder]
  );

  const {manager, state} = useRemirror({
    extensions,
    content: initialContent as RemirrorContentType | undefined,
    stringHandler
  });

  return (
    <AllStyledComponent>
      <ThemeProvider theme={theme}>
        <Remirror manager={manager} initialContent={state} {...rest}>
          <ImperativeHandle ref={ref} />
          <TopToolbar />
          <EditorComponent />
          <BubbleMenu />
          <TableComponents />
          {children}
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
});

export default React.memo(MyWysiwygEditor);
