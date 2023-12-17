import React, {FC, MouseEvent, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BoardDTO, EditorReadOnlyRef, EditorRef, ReplyDTO} from '../BoardPage';
import {DateTime} from 'luxon';
import EditorReadOnly from './EditorReadOnly';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useAppDispatch} from '../../../../app/hooks';
import {
  useDeleteBoardMutation,
  useLikeBoardMutation
} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import ReplyList from './ReplyList';

type BoardProps = {
  memberId: string | null;
  panelId: string;
  mode: 'preview' | 'detail';
  boardDTO: BoardDTO;
  replyDTOList: ReplyDTO[] | null | undefined;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  editorRef: React.MutableRefObject<EditorRef | null>;
  editorReadOnlyRef: React.MutableRefObject<EditorReadOnlyRef | null>;
};

const Board: FC<BoardProps> = ({
  memberId,
  panelId,
  mode,
  boardDTO,
  replyDTOList,
  loadBoard,
  editorRef,
  editorReadOnlyRef
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [confirmDeleteBoard, setConfirmDeleteBoard] = useState<boolean>(false);

  const [like, setLike] = useState<boolean | null>(null);

  const [likeUpdated, setLikeUpdated] = useState<boolean>(false);

  const [
    requestBoardDelete,
    {isSuccess: isSuccessDelete, isError: isErrorDelete, reset: resetDelete}
  ] = useDeleteBoardMutation();

  const [requestBoardLike, {isSuccess: isSuccessLike, isError: isErrorLike}] =
    useLikeBoardMutation();

  const onClickLike = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLike(true);
  }, []);

  const onClickNotLike = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLike(false);
  }, []);

  const updateLike = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        const likeRequest = {
          id: boardDTO.boardId,
          number: like == true ? 1 : -1
        };
        await requestBoardLike(likeRequest);
        await loadBoard(boardDTO.boardId, false);
      } catch (err) {
        console.log(err);
      }
    },
    [boardDTO.boardId, like, requestBoardLike, loadBoard]
  );

  const onClickToggleDetail = useCallback(
    async (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        if (mode == 'preview') {
          await loadBoard(boardDTO?.boardId as string, false);
        } else if (mode == 'detail') {
          await loadBoard(null, false);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [boardDTO?.boardId, mode, loadBoard]
  );

  const onClickSearchTag = useCallback(
    (tag: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          tag: tag,
          searchDisabled: false,
          searchMode: true,
          currentPage: 1,
          targetPage: 1
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const enableBoardEditorToModify = useCallback(
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
          content: JSON.parse(boardDTO.content as string),
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

  const deleteBoard = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteBoard(true);
  }, []);

  const cancelDeleteBoard = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteBoard(false);
  }, []);

  const reallyDeleteBoard = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await requestBoardDelete(boardDTO.boardId);
        await loadBoard(boardDTO.boardId, true);
      } catch (err) {
        console.log(err);
      }
    },
    [boardDTO.boardId, requestBoardDelete, loadBoard]
  );

  useEffect(() => {
    if (isSuccessDelete || isErrorDelete) {
      const id = setTimeout(() => {
        setConfirmDeleteBoard(false);
        resetDelete();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [isSuccessDelete, isErrorDelete, resetDelete]);

  useEffect(() => {
    if (isSuccessLike) {
      setLikeUpdated(true);
    } else if (isErrorLike) {
      setLike(null);
      setLikeUpdated(true);
    }
  }, [isSuccessLike, isErrorLike]);

  return (
    <div className="relative border-b border-warning my-2 mr-2">
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
          <div
            onClick={onClickToggleDetail}
            className="text-md text-info ml-16 hover:text-accent"
          >
            {boardDTO?.title}
          </div>
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
          <div hidden={mode == 'preview' || memberId == null}>
            <div className="flex gap-1">
              <div
                className={
                  like == null ? 'invisible -mt-1 mr-1' : 'visible -mt-1 mr-1'
                }
              >
                <button
                  onClick={updateLike}
                  disabled={likeUpdated}
                  className="btn btn-xs btn-circle btn-outline btn-warning"
                >
                  <i className="ri-arrow-left-double-line ri-1x"></i>
                </button>
              </div>
              <button
                disabled={likeUpdated}
                onClick={onClickLike}
                className={
                  like == true
                    ? 'btn btn-xs btn-circle btn-outline btn-accent btn-active'
                    : 'btn btn-xs btn-circle btn-outline btn-accent'
                }
              >
                <i className="ri-thumb-up-line ri-1x"></i>
              </button>
              <button
                disabled={likeUpdated}
                onClick={onClickNotLike}
                className={
                  like == false
                    ? 'btn btn-xs btn-circle btn-outline btn-error btn-active'
                    : 'btn btn-xs btn-circle btn-outline btn-error'
                }
              >
                <i className="ri-thumb-down-line ri-1x"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="flex mb-2 mr-4 gap-4">
          {boardDTO?.tag1 && (
            <button
              className="text-xs text-info btn-ghost rounded -mt-1 px-0.5"
              onClick={onClickSearchTag(boardDTO?.tag1)}
            >
              {boardDTO?.tag1}
            </button>
          )}
          {boardDTO?.tag2 && (
            <button
              className="text-xs text-info btn-ghost rounded -mt-1 px-0.5"
              onClick={onClickSearchTag(boardDTO?.tag2)}
            >
              {boardDTO?.tag2}
            </button>
          )}
          {boardDTO?.tag3 && (
            <button
              className="text-xs text-info btn-ghost rounded -mt-1 px-0.5"
              onClick={onClickSearchTag(boardDTO?.tag3)}
            >
              {boardDTO?.tag3}
            </button>
          )}
        </div>
      </div>
      {mode == 'preview' ? (
        <div
          onClick={onClickToggleDetail}
          className="mb-2 line-clamp-1 text-sm text-info hover:text-accent"
        >
          {boardDTO?.preview}
        </div>
      ) : (
        <EditorReadOnly
          initialContent={JSON.parse(boardDTO?.content as string)}
          editorReadOnlyRef={editorReadOnlyRef}
        />
      )}
      <div hidden={mode == 'preview'}>
        <div className="flex justify-between my-1">
          <button
            disabled={memberId == null}
            className="btn btn-xs btn-circle btn-outline btn-warning m-1"
          >
            <i className="ri-reply-line ri-1x"></i>
          </button>
          <div className="justify-center">
            <button
              onClick={onClickToggleDetail}
              className="btn btn-xs btn-circle btn-outline btn-info hover:btn-accent m-1"
            >
              <i className="ri-skip-up-line ri-1x"></i>
            </button>
          </div>
          <div className="justify-end">
            <div hidden={memberId != boardDTO.memberId || confirmDeleteBoard}>
              <button
                className="btn btn-xs btn-circle btn-outline btn-accent m-1"
                onClick={enableBoardEditorToModify}
              >
                <i className="ri-edit-2-line ri-1x"></i>
              </button>
              <button
                className="btn btn-xs btn-circle btn-outline btn-error m-1"
                onClick={deleteBoard}
              >
                <i className="ri-delete-bin-line ri-1x"></i>
              </button>
            </div>
            <div hidden={memberId != boardDTO.memberId || !confirmDeleteBoard}>
              <button
                onClick={cancelDeleteBoard}
                className="btn btn-xs btn-ghost mr-1"
              >
                {t('Common.Cancel')}
              </button>
              {isErrorDelete ? (
                <div className="ml-2.5 mr-3">
                  <MaterialSymbolError size={19} />
                </div>
              ) : isSuccessDelete ? (
                <div className="ml-2.5 mr-3">
                  <MaterialSymbolSuccess size={19} />
                </div>
              ) : (
                <button
                  onClick={reallyDeleteBoard}
                  className="btn btn-xs btn-accent"
                >
                  {t('Common.Delete')}
                </button>
              )}
            </div>
          </div>
        </div>
        {/*<ReplyList*/}
        {/*  panelId={panelId}*/}
        {/*  memberId={memberId}*/}
        {/*  boardId={boardDTO.boardId}*/}
        {/*  replyDTOList={replyDTOList}*/}
        {/*  loadBoard={loadBoard}*/}
        {/*  editorRef={editorRef}*/}
        {/*  editorReadOnlyRef={editorReadOnlyRef}*/}
        {/*/>*/}
      </div>
    </div>
  );
};

export default React.memo(Board);
