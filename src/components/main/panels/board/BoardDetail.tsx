import React, {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {BoardDTO} from '../BoardPage';
import {DateTime} from 'luxon';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {
  useDeleteBoardMutation,
  useLazyReadBoardQuery,
  useLikeBoardMutation
} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import ReplyList from './ReplyList';
import Editor from './Editor';
import {BoardPageState} from '../../../../app/constants/panelInfo';
import {EditorStateProps, RemirrorContentType} from 'remirror';

export interface IdDTO {
  id: string;
}

export interface ReplyDTO {
  replyId: string;
  parentId: string;
  memberId: string;
  nickname: string;
  content: string;
  likeCount: number;
  regDate: string;
  modDate: string;
}

interface BoardReplyDTO {
  boardDTO: BoardDTO;
  replyDTOList: ReplyDTO[];
}

interface GetTextHelperOptions extends Partial<EditorStateProps> {
  lineBreakDivider?: string;
}

export interface EditorRef {
  clearContent: () => void;
  setContent: (content: RemirrorContentType) => void;
  getText: ({lineBreakDivider}: GetTextHelperOptions) => string;
}

type BoardDetailProps = {
  memberId: string | null;
  memberRole: string | null;
  panelId: string;
};

const BoardDetail: FC<BoardDetailProps> = ({memberId, memberRole, panelId}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const boardEditorRef = useRef<EditorRef | null>(null);

  const replyEditorRef = useRef<EditorRef | null>(null);

  const [requestBoardRead] = useLazyReadBoardQuery();

  const [requestBoardLike, {isSuccess: isSuccessLike, isError: isErrorLike}] =
    useLikeBoardMutation();

  const [
    requestBoardDelete,
    {isSuccess: isSuccessDelete, isError: isErrorDelete, reset: resetDelete}
  ] = useDeleteBoardMutation();

  const [boardDTO, setBoardDTO] = useState<BoardDTO | null>(null);

  const [replyDTOList, setReplyDTOList] = useState<ReplyDTO[] | null>(null);

  const [confirmDeleteBoard, setConfirmDeleteBoard] = useState<boolean>(false);

  const [like, setLike] = useState<boolean | null>(null);

  const [likeUpdated, setLikeUpdated] = useState<boolean>(false);

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
          id: boardPageState.boardId as string,
          number: like == true ? 1 : -1
        };
        await requestBoardLike(likeRequest);
      } catch (err) {
        console.log(err);
      }
    },
    [boardPageState.boardId, like, requestBoardLike]
  );

  const onClickToPreview = useCallback(
    (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          showBoardEditor: false,
          boardId: null
        }
      };
      dispatch(updatePanelState(payload));
    },
    [panelId, dispatch]
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
          boardId: boardDTO?.boardId,
          nickname: boardDTO?.nickname,
          title: boardDTO?.title,
          boardCategory: boardDTO?.boardCategory,
          preview: boardDTO?.preview,
          content: JSON.parse(boardDTO?.content as string),
          tag1: boardDTO?.tag1,
          tag2: boardDTO?.tag2,
          tag3: boardDTO?.tag3
        }
      };
      dispatch(updatePanelState(payload));
      // boardEditorRef.current?.setContent(
      //   JSON.parse(boardDTO?.content as string)
      // );
    },
    [
      dispatch,
      panelId,
      boardDTO?.boardId,
      boardDTO?.nickname,
      boardDTO?.title,
      boardDTO?.boardCategory,
      boardDTO?.preview,
      boardDTO?.content,
      boardDTO?.tag1,
      boardDTO?.tag2,
      boardDTO?.tag3
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
      } catch (err) {
        console.log(err);
      }
    },
    [boardDTO.boardId, requestBoardDelete]
  );

  const enableReplyEditor = useCallback(
    (parentId: string | null) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          showReplyEditor: true,
          parentId: parentId
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  // const resetBoardEditorState = useCallback(() => {
  //   boardEditorRef.current?.clearContent();
  //   const payload = {
  //     panelId: panelId,
  //     panelState: {
  //       showBoardEditor: false,
  //       boardId: null,
  //       boardCategory: '0',
  //       title: '',
  //       tag1: '',
  //       tag2: '',
  //       tag3: '',
  //       preview: null,
  //       content: undefined
  //     }
  //   };
  //   dispatch(updatePanelState(payload));
  // }, [dispatch, panelId, boardEditorRef]);

  // const resetReplyEditorState = useCallback(() => {
  //   replyEditorRef.current?.clearContent();
  //   const payload = {
  //     panelId: panelId,
  //     panelState: {
  //       showReplyEditor: false,
  //       replyId: null,
  //       parentId: null,
  //       preview: null,
  //       content: undefined
  //     }
  //   };
  //   dispatch(updatePanelState(payload));
  // }, [dispatch, panelId, replyEditorRef]);

  // useEffect(() => {
  //   if (currentBoardId != null) {
  //     try {
  //       const currentBoard = boardDTOList?.find(
  //         (boardDTO) => boardDTO.boardId == currentBoardId
  //       );
  //       if (currentBoard && currentBoard.content == null) {
  //         loadBoard(currentBoardId, true);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }, [loadBoard, boardDTOList, currentBoardId]);

  const loadBoard = useCallback(
    async (boardId: string, setContent: boolean) => {
      const dataBoard = await requestBoardRead(boardId as string).unwrap();
      setBoardDTO((dataBoard?.apiObj as BoardReplyDTO)?.boardDTO);
      setReplyDTOList((dataBoard?.apiObj as BoardReplyDTO)?.replyDTOList);
      if (setContent) {
        boardEditorRef.current?.setContent(
          JSON.parse(
            (dataBoard?.apiObj as BoardReplyDTO)?.boardDTO.content as string
          )
        );
      }
    },
    [requestBoardRead]
  );

  useEffect(() => {
    if (
      boardPageState.boardId != null &&
      !boardPageState.showBoardEditor &&
      !boardPageState.showReplyEditor
    ) {
      try {
        void loadBoard(boardPageState.boardId, false);
      } catch (err) {
        console.error(err);
      }
    }
  }, [
    loadBoard,
    boardPageState.boardId,
    boardPageState.showBoardEditor,
    boardPageState.showReplyEditor
  ]);

  useEffect(() => {
    if (memberId == null && boardPageState.showReplyEditor) {
      resetReplyEditorState();
    }
  }, [memberId, resetReplyEditorState, boardPageState.showReplyEditor]);

  useEffect(() => {
    if (isSuccessDelete || isErrorDelete) {
      const id = setTimeout(() => {
        if (isSuccessDelete) {
          loadBoard(boardDTO.boardId, true);
          setConfirmDeleteBoard(false);
        }
        resetDelete();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    boardDTO.boardId,
    loadBoard,
    isSuccessDelete,
    isErrorDelete,
    resetDelete
  ]);

  useEffect(() => {
    if (isSuccessLike) {
      loadBoard(boardDTO.boardId, false);
      setLikeUpdated(true);
    } else if (isErrorLike) {
      setLike(null);
      setLikeUpdated(true);
    }
  }, [boardDTO.boardId, loadBoard, isSuccessLike, isErrorLike]);

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
          <div
            onClick={onClickToPreview}
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
          <div hidden={memberId == null}>
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
      <Editor
        onChange={handleEditorChange}
        initialContent={JSON.parse(boardDTO?.content as string)}
        editorRef={boardEditorRef}
        editable={false}
      />
      <div className="flex justify-between my-1">
        <button
          disabled={memberId == null || boardPageState.showReplyEditor}
          onClick={enableReplyEditor(null)}
          className="btn btn-xs btn-circle btn-outline btn-warning m-1"
        >
          <i className="ri-reply-line ri-1x"></i>
        </button>
        <div className="justify-center">
          <button
            onClick={onClickToPreview}
            className="btn btn-xs btn-circle btn-outline btn-info hover:btn-accent m-1"
          >
            <i className="ri-skip-up-line ri-1x"></i>
          </button>
        </div>
        <div className="justify-end">
          <div hidden={memberId != boardDTO.memberId || confirmDeleteBoard}>
            <button
              disabled={boardPageState.showReplyEditor}
              className="btn btn-xs btn-circle btn-outline btn-accent m-1"
              onClick={enableBoardEditorToModify}
            >
              <i className="ri-edit-2-line ri-1x"></i>
            </button>
            <button
              disabled={boardPageState.showReplyEditor}
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
      <ReplyList
        panelId={panelId}
        memberId={memberId}
        boardId={boardDTO.boardId}
        replyDTOList={replyDTOList}
        loadBoard={loadBoard}
        replyEditorRef={replyEditorRef}
        enableReplyEditor={enableReplyEditor}
        resetReplyEditorState={resetReplyEditorState}
      />
    </div>
  );
};

export default React.memo(BoardDetail);
