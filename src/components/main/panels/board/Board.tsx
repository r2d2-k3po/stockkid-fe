import React, {FC, MouseEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {BoardDTO, EditorRef, ReplyDTO} from '../BoardPage';
import {DateTime} from 'luxon';
import EditorReadOnly from './EditorReadOnly';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useAppDispatch} from '../../../../app/hooks';

type BoardProps = {
  memberId: string | null;
  memberRole: string | null;
  panelId: string;
  mode: 'preview' | 'detail';
  boardDTO: BoardDTO;
  replyDTOList: ReplyDTO[] | null | undefined;
  loadBoard: (boardId: string | null) => void;
  editorRef: React.MutableRefObject<EditorRef | null>;
};

const Board: FC<BoardProps> = ({
  memberId,
  memberRole,
  panelId,
  mode,
  boardDTO,
  replyDTOList,
  loadBoard,
  editorRef
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const onClickToggleDetail = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (mode == 'preview') {
        loadBoard(boardDTO?.boardId as string);
      } else if (mode == 'detail') {
        loadBoard(null);
      }
    },
    [boardDTO?.boardId, mode, loadBoard]
  );

  const enableEditorToModify = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          showBoardEditor: true,
          boardId: boardDTO.boardId,
          nickname: boardDTO.nickname,
          title: boardDTO.title,
          boardCategory: boardDTO.boardCategory,
          preview: boardDTO.preview,
          content: boardDTO.content,
          tag1: boardDTO.tag1,
          tag2: boardDTO.tag2,
          tag3: boardDTO.tag3
        }
      };
      dispatch(updatePanelState(payload));
      editorRef.current?.setContent(JSON.parse(boardDTO.content as string));
    },
    [
      dispatch,
      panelId,
      boardDTO.boardId,
      boardDTO.nickname,
      boardDTO.title,
      boardDTO.boardCategory,
      boardDTO.preview,
      boardDTO.content,
      boardDTO.tag1,
      boardDTO.tag2,
      boardDTO.tag3,
      editorRef
    ]
  );

  return (
    <div className="border-b border-warning my-2 mr-2">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-user-line ri-1x"></i>
          <button
            className={
              memberId == boardDTO.memberId
                ? 'text-sm text-primary btn-ghost rounded -mt-1 px-0.5'
                : 'text-sm text-info btn-ghost rounded -mt-1 px-0.5'
            }
          >
            {boardDTO?.nickname}
          </button>
          <button
            onClick={onClickToggleDetail}
            className="text-md text-info ml-16 hover:text-accent"
          >
            {boardDTO?.title}
          </button>
        </div>
        <div className="flex justify-end mb-2">
          <i className="ri-time-line ri-1x"></i>
          <div className="text-sm text-info mx-1">
            {DateTime.fromISO(
              boardDTO?.modDate.split('.')[0] as string
            ).toFormat('HH:mm yyyy-MM-dd')}
          </div>
          <div className="text-xs text-info text-center w-16 mx-2 border-[1px] border-secondary rounded-lg my-0.5">
            {t(
              `BoardPage.Category.${
                boardDTO?.boardCategory as 'STOCK' | 'LIFE' | 'QA' | 'NOTICE'
              }`
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-eye-line ri-1x"></i>
          <div className="text-sm text-info">{boardDTO?.readCount}</div>
          <i className="ri-chat-1-line ri-1x"></i>
          <div className="text-sm text-info">{boardDTO?.replyCount}</div>
          <i className="ri-star-line ri-1x"></i>
          <div className="text-sm text-info">{boardDTO?.likeCount}</div>
        </div>
        <div className="flex mb-2 mr-4 gap-4">
          {boardDTO?.tag1 && (
            <button className="text-xs text-info btn-ghost rounded -mt-1 px-0.5">
              {boardDTO?.tag1}
            </button>
          )}
          {boardDTO?.tag2 && (
            <button className="text-xs text-info btn-ghost rounded -mt-1 px-0.5">
              {boardDTO?.tag2}
            </button>
          )}
          {boardDTO?.tag3 && (
            <button className="text-xs text-info btn-ghost rounded -mt-1 px-0.5">
              {boardDTO?.tag3}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={onClickToggleDetail}
        className="mb-2 line-clamp-1 text-sm text-info hover:text-accent"
      >
        {mode == 'preview' ? (
          boardDTO?.preview
        ) : mode == 'detail' ? (
          <EditorReadOnly
            initialContent={JSON.parse(boardDTO?.content as string)}
          />
        ) : (
          'error'
        )}
      </button>
      <div hidden={mode == 'preview'}>
        <div className="flex justify-between mb-1">
          <button
            disabled={memberId == null}
            className="btn btn-xs btn-circle btn-outline btn-warning m-1"
          >
            <i className="ri-reply-line ri-1x"></i>
          </button>
          <div className="justify-end">
            <div hidden={memberId != boardDTO.memberId}>
              <button
                className="btn btn-xs btn-circle btn-outline btn-accent m-1"
                onClick={enableEditorToModify}
              >
                <i className="ri-edit-2-line ri-1x"></i>
              </button>
              <button className="btn btn-xs btn-circle btn-outline btn-error m-1">
                <i className="ri-delete-bin-line ri-1x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Board);
