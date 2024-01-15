// import '@remirror/styles/all.css';
import './remirror/all.css';
import React, {
  FC,
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle
} from 'react';
import {
  PlaceholderExtension,
  BulletListExtension,
  HardBreakExtension,
  HeadingExtension,
  LinkExtension,
  OrderedListExtension,
  TaskListExtension
} from 'remirror/extensions';
import {TableExtension} from '@remirror/extension-react-tables';
import {
  EditorComponent,
  OnChangeJSON,
  ListButtonGroup,
  Toolbar,
  Remirror,
  TableComponents,
  useHelpers,
  useRemirror,
  useRemirrorContext
} from '@remirror/react';

import {BubbleMenu} from './remirror/BubbleMenu';
import {TopToolbar} from './remirror/TopToolbar';
import {RemirrorContentType, RemirrorJSON} from 'remirror';
import {EditorRef} from './BoardDetail';
import {useTranslation} from 'react-i18next';

const ImperativeHandle = forwardRef(function ImperativeHandle(
  _: unknown,
  ref: Ref<EditorRef>
) {
  const {clearContent, setContent} = useRemirrorContext({
    autoUpdate: true
  });

  const {getText} = useHelpers();

  // Expose content handling to outside
  useImperativeHandle(ref, () => {
    return {clearContent, setContent, getText};
  });
  return <></>;
});

type OnChangeType = (json: RemirrorJSON) => void;

type EditorProps = {
  onChange: OnChangeType;
  initialContent: RemirrorContentType | undefined;
  editorRef: React.MutableRefObject<EditorRef | null>;
  editable: boolean;
};

const MyEditor: FC = () => {
  const {t} = useTranslation();

  const editable = true;

  const extensions = useCallback(() => {
    const ext = [
      new BulletListExtension(),
      new OrderedListExtension(),
      new TaskListExtension(),
      new HeadingExtension(),
      new LinkExtension(),
      new HardBreakExtension(),
      new TableExtension()
    ];
    if (editable) {
      const placeholder = t('Editor.placeholder') as string;
      return [new PlaceholderExtension({placeholder}), ...ext];
    }
    return ext;
  }, [editable, t]);

  const html = String.raw; // Just for better editor support

  const content = html`
    <ul>
      <li>first unordered list item</li>
      <li>second unordered list item</li>
    </ul>
    <ol>
      <li>first ordered list item</li>
      <li>second ordered list item</li>
    </ol>
    <ul data-task-list>
      <li data-task-list-item>first task list item</li>
      <li data-task-list-item data-checked>second task list item</li>
    </ul>

    <h2>Nested bullet list:</h2>

    <ul>
      <li>A</li>
      <li>B</li>
      <li>
        C
        <ul>
          <li>C.A</li>
          <li>
            C.B
            <ul>
              <li>C.B.A</li>
              <li>C.B.B</li>
              <li>C.B.C</li>
            </ul>
          </li>
          <li>C.C</li>
        </ul>
      </li>
    </ul>

    <h2>Nested ordered list:</h2>

    <ol>
      <li>A</li>
      <li>B</li>
      <li>
        C
        <ol>
          <li>C.A</li>
          <li>
            C.B
            <ol>
              <li>C.B.A</li>
              <li>C.B.B</li>
              <li>C.B.C</li>
            </ol>
          </li>
          <li>C.C</li>
        </ol>
      </li>
    </ol>

    <h2>Nested task list:</h2>

    <ul data-task-list>
      <li data-task-list-item data-checked>A</li>
      <li data-task-list-item>B</li>
      <li data-task-list-item data-checked>
        C
        <ul data-checked data-task-list>
          <li data-task-list-item>C.A</li>
          <li data-task-list-item>
            C.B
            <ul data-task-list>
              <li data-task-list-item data-checked>C.B.A</li>
              <li data-task-list-item data-checked>C.B.B</li>
              <li data-task-list-item>C.B.C</li>
            </ul>
          </li>
          <li>C.C</li>
        </ul>
      </li>
    </ul>

    <h2>Nested mixed list:</h2>

    <ul>
      <li>A</li>
      <li>B</li>
      <li>
        C
        <ul data-task-list>
          <li data-task-list-item>C.A</li>
          <li data-task-list-item data-checked>
            C.B
            <ol>
              <li>C.B.A</li>
              <li>C.B.B</li>
              <li>C.B.C</li>
            </ol>
          </li>
          <li data-task-list-item data-checked>C.C</li>
        </ul>
      </li>
    </ul>
  `;

  const {manager, state} = useRemirror({
    extensions,
    // content: initialContent as RemirrorContentType | undefined,
    content: content,
    stringHandler: 'html'
  });

  return (
    <div className="remirror-theme relative mb-[1px]">
      <Remirror manager={manager} initialContent={state} editable={editable}>
        {editable && (
          <>
            {/*<TopToolbar />*/}
            <Toolbar>
              <ListButtonGroup />
            </Toolbar>
          </>
        )}
        <EditorComponent />
        {editable && (
          <>
            {/*<BubbleMenu />*/}
            <TableComponents />
          </>
        )}
      </Remirror>
    </div>
  );
};

export default React.memo(MyEditor);
