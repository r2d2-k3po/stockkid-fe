import React, {
  ChangeEvent,
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
  BoardSaveRequest,
  useDeleteBoardMutation,
  useLazyReadBoardQuery,
  useLikeBoardMutation,
  useModifyBoardMutation,
  useRegisterBoardMutation
} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import ReplyList from './ReplyList';
import Editor from './Editor';
import {BoardPageState} from '../../../../app/constants/panelInfo';
import {EditorStateProps, RemirrorContentType, RemirrorJSON} from 'remirror';

export interface IdDTO {
  id: string;
}

export interface ReplyDTO {
  replyId: string | null;
  parentId: string | null;
  memberId: string | null;
  nickname: string | null;
  content: string | null;
  likeCount: number | null;
  regDate: string | null;
  modDate: string | null;
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

type BoardTextType = {
  nickname: string;
  title: string;
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
  preview: string | undefined;
  content: RemirrorContentType | undefined;
};

type BoardDetailProps = {
  memberId: string | null;
  memberRole: string | null;
  panelId: string;
  setBoardDTOList: React.Dispatch<
    React.SetStateAction<BoardDTO[] | null | undefined>
  >;
};

const BoardDetail: FC<BoardDetailProps> = ({
  memberId,
  memberRole,
  panelId,
  setBoardDTOList
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{2,30}$/;

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const boardEditorRef = useRef<EditorRef | null>(null);

  const [requestBoardRead] = useLazyReadBoardQuery();

  const [
    requestBoardLike,
    {isSuccess: isSuccessLike, isError: isErrorLike, reset: resetLike}
  ] = useLikeBoardMutation();

  const [
    requestBoardDelete,
    {isSuccess: isSuccessDelete, isError: isErrorDelete, reset: resetDelete}
  ] = useDeleteBoardMutation();

  const [
    requestBoardRegister,
    {
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      reset: resetRegister
    }
  ] = useRegisterBoardMutation();

  const [
    requestBoardModify,
    {isSuccess: isSuccessModify, isError: isErrorModify, reset: resetModify}
  ] = useModifyBoardMutation();

  const [boardDTO, setBoardDTO] = useState<BoardDTO | null>(null);

  const [replyDTOList, setReplyDTOList] = useState<ReplyDTO[] | null>(null);

  const [like, setLike] = useState<boolean | null>(null);

  const [likeUpdated, setLikeUpdated] = useState<boolean>(false);

  const [confirmDeleteBoard, setConfirmDeleteBoard] = useState<boolean>(false);

  const [boardText, setBoardText] = useState<BoardTextType>({
    nickname: boardPageState.nickname,
    title: boardPageState.title,
    tag1: boardPageState.tag1,
    tag2: boardPageState.tag2,
    tag3: boardPageState.tag3,
    preview: boardPageState.preview,
    content: boardPageState.content
  });

  // boardPageState.showBoardEditor == false ->

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
          boardCategory: boardDTO?.boardCategory
        }
      };
      dispatch(updatePanelState(payload));
      setBoardText({
        nickname: boardDTO?.nickname as string,
        title: boardDTO?.title as string,
        tag1: boardDTO?.tag1 as string,
        tag2: boardDTO?.tag2 as string,
        tag3: boardDTO?.tag3 as string,
        preview: boardDTO?.preview,
        content: JSON.parse(boardDTO?.content as string)
      });
    },
    [
      dispatch,
      panelId,
      boardDTO?.boardId,
      boardDTO?.boardCategory,
      boardDTO?.nickname,
      boardDTO?.title,
      boardDTO?.tag1,
      boardDTO?.tag2,
      boardDTO?.tag3,
      boardDTO?.preview,
      boardDTO?.content
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
        await requestBoardDelete(boardDTO?.boardId as string);
      } catch (err) {
        console.log(err);
      }
    },
    [boardDTO?.boardId, requestBoardDelete]
  );

  const enableReplyEditor = useCallback(
    (parentId: string | null) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          showReplyEditor: true,
          replyId: null,
          parentId: parentId
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const loadBoard = useCallback(
    async (boardId: string) => {
      const dataBoard = await requestBoardRead(boardId as string).unwrap();
      setBoardDTO((dataBoard?.apiObj as BoardReplyDTO)?.boardDTO);
      setReplyDTOList((dataBoard?.apiObj as BoardReplyDTO)?.replyDTOList);
      setBoardDTOList((boardDTOList) =>
        boardDTOList?.map((bDTO) => {
          if (bDTO.boardId == boardPageState.boardId) {
            return (dataBoard?.apiObj as BoardReplyDTO)?.boardDTO;
          } else {
            return bDTO;
          }
        })
      );
      boardEditorRef.current?.setContent(
        JSON.parse(
          (dataBoard?.apiObj as BoardReplyDTO)?.boardDTO.content as string
        )
      );
    },
    [boardPageState.boardId, requestBoardRead, setBoardDTOList]
  );

  useEffect(() => {
    if (boardPageState.boardId != null) {
      try {
        void loadBoard(boardPageState.boardId);
      } catch (err) {
        console.error(err);
      }
    }
  }, [loadBoard, boardPageState.boardId]);

  useEffect(() => {
    if (isSuccessLike) {
      const number = like == true ? 1 : -1;
      const likeCount = (boardDTO?.likeCount as number) + number;
      setBoardDTO((boardDTO) => {
        return {...(boardDTO as BoardDTO), likeCount: likeCount};
      });
      setBoardDTOList((boardDTOList) =>
        boardDTOList?.map((bDTO) => {
          if (bDTO.boardId == boardPageState.boardId) {
            return {
              ...bDTO,
              likeCount: likeCount
            };
          } else {
            return bDTO;
          }
        })
      );
      setLikeUpdated(true);
      resetLike();
    } else if (isErrorLike) {
      setLike(null);
      setLikeUpdated(true);
      resetLike();
    }
  }, [
    isSuccessLike,
    isErrorLike,
    like,
    resetLike,
    boardDTO?.likeCount,
    boardPageState.boardId,
    setBoardDTOList
  ]);

  useEffect(() => {
    setLike(null);
    setLikeUpdated(false);
  }, [boardPageState.boardId]);

  useEffect(() => {
    if (isSuccessDelete || isErrorDelete) {
      const id = setTimeout(() => {
        if (isSuccessDelete) {
          setBoardDTO((boardDTO) => {
            return {
              ...(boardDTO as BoardDTO),
              title: 'deleted',
              preview: 'deleted',
              content:
                '{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":null,"ignoreBidiAutoUpdate":null},"content":[{"type":"text","text":"deleted"}]}]}'
            };
          });
          boardEditorRef.current?.setContent(
            JSON.parse(
              '{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":null,"ignoreBidiAutoUpdate":null},"content":[{"type":"text","text":"deleted"}]}]}'
            )
          );
          setBoardDTOList((boardDTOList) =>
            boardDTOList?.map((bDTO) => {
              if (bDTO.boardId == boardPageState.boardId) {
                return {
                  ...bDTO,
                  title: 'deleted',
                  preview: 'deleted'
                };
              } else {
                return bDTO;
              }
            })
          );
          setConfirmDeleteBoard(false);
        }
        resetDelete();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    resetDelete,
    boardPageState.boardId,
    setBoardDTOList
  ]);

  // <- boardPageState.showBoardEditor == false

  // boardPageState.showBoardEditor == true ->

  const handleChangeBoardForm = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        setBoardText((boardText) => {
          return {
            ...boardText,
            [key]: key == 'title' ? e.target.value : e.target.value.trim()
          };
        });
      }
    },
    []
  );

  const handleChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          boardCategory: e.target.value as 'STOCK' | 'LIFE' | 'QA' | 'NOTICE'
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    setBoardText((boardText) => {
      return {
        ...boardText,
        preview: boardEditorRef.current?.getText({lineBreakDivider: ' '}),
        content: json
      };
    });
  }, []);

  const resetBoardEditorState = useCallback(() => {
    const payload = {
      panelId: panelId,
      panelState: {
        showBoardEditor: false,
        boardCategory: '0',
        title: '',
        tag1: null,
        tag2: null,
        tag3: null,
        preview: undefined,
        content: undefined
      }
    };
    dispatch(updatePanelState(payload));
    setBoardText({
      nickname: localStorage.getItem('nickname') || '',
      title: '',
      tag1: null,
      tag2: null,
      tag3: null,
      preview: undefined,
      content: undefined
    });
  }, [dispatch, panelId]);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (boardPageState.boardId == null) {
        boardEditorRef.current?.clearContent();
      } else {
        boardEditorRef.current?.setContent(
          JSON.parse(boardDTO?.content as string)
        );
      }
      resetBoardEditorState();
    },
    [boardDTO?.content, boardPageState.boardId, resetBoardEditorState]
  );

  const onClickSave = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        localStorage.setItem('nickname', boardText.nickname);
        const boardSaveRequest: BoardSaveRequest = {
          boardId: boardPageState.boardId,
          boardCategory: boardPageState.boardCategory,
          nickname: boardText.nickname,
          title: boardText.title,
          preview: boardText.preview as string,
          content: JSON.stringify(boardText.content),
          tag1: boardText.tag1 || null,
          tag2: boardText.tag2 || null,
          tag3: boardText.tag3 || null
        };
        if (boardPageState.boardId == null) {
          const data = await requestBoardRegister(boardSaveRequest).unwrap();
          const boardId = (data?.apiObj as IdDTO)?.id;
          const payload = {
            panelId: panelId,
            panelState: {
              boardId: boardId
            }
          };
          dispatch(updatePanelState(payload));
        } else {
          await requestBoardModify(boardSaveRequest);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      boardPageState.boardId,
      boardText.nickname,
      boardPageState.boardCategory,
      boardText.title,
      boardText.preview,
      boardText.content,
      boardText.tag1,
      boardText.tag2,
      boardText.tag3,
      requestBoardRegister,
      requestBoardModify,
      panelId,
      dispatch
    ]
  );

  useEffect(() => {
    if (isSuccessRegister || isErrorRegister) {
      const id = setTimeout(() => {
        if (isSuccessRegister) {
          setBoardDTOList((boardDTOList) => {
            return [boardDTO as BoardDTO, ...(boardDTOList as BoardDTO[])];
          });
          resetBoardEditorState();
        }
        resetRegister();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    isSuccessRegister,
    isErrorRegister,
    resetBoardEditorState,
    resetRegister,
    boardDTO,
    setBoardDTOList
  ]);

  useEffect(() => {
    if (isSuccessModify || isErrorModify) {
      const id = setTimeout(() => {
        if (isSuccessModify) {
          try {
            void loadBoard(boardPageState.boardId as string);
          } catch (err) {
            console.error(err);
          }
          resetBoardEditorState();
        }
        resetModify();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    isSuccessModify,
    isErrorModify,
    resetBoardEditorState,
    resetModify,
    loadBoard,
    boardPageState.boardId
  ]);

  // disable BoardEditor when logged out
  useEffect(() => {
    if (memberId == null && boardPageState.showBoardEditor) {
      const payload = {
        panelId: panelId,
        panelState: {
          showBoardEditor: false
        }
      };
      dispatch(updatePanelState(payload));
    }
  }, [memberId, boardPageState.showBoardEditor, panelId, dispatch]);

  // prepare for new content to register
  useEffect(() => {
    if (boardPageState.boardId == null && boardPageState.showBoardEditor) {
      boardEditorRef.current?.clearContent();
    }
  }, [boardPageState.boardId, boardPageState.showBoardEditor]);

  // settings for unintentional unmounting
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  // setContent only when mounting with BoardEditor open (empty dependency list)
  useEffect(() => {
    if (boardPageState.showBoardEditor && mounted.current) {
      boardEditorRef.current?.setContent(
        boardText.content as RemirrorContentType
      );
    }
  }, []);

  // save BoardEditor info when unintentionally unmounting
  useEffect(() => {
    return () => {
      if (boardPageState.showBoardEditor && !mounted.current) {
        const payload = {
          panelId: panelId,
          panelState: boardText
        };
        dispatch(updatePanelState(payload));
      }
    };
  }, [panelId, dispatch, boardPageState.showBoardEditor, boardText]);

  // <- boardPageState.showBoardEditor == true

  if (
    (boardPageState.boardId != null && boardDTO == null) ||
    (boardPageState.boardId == null && !boardPageState.showBoardEditor)
  ) {
    return null;
  }

  return (
    <div className="border-b border-warning my-2 mx-3">
      {boardPageState.showBoardEditor ? (
        // boardPageState.showBoardEditor == true ->
        <>
          <div className="flex justify-between">
            <div className="flex justify-start mb-2 gap-2">
              <i className="ri-user-line ri-1x"></i>
              <input
                type="text"
                name="nickname"
                placeholder={t('Board.placeholder.nickname') as string}
                value={boardText.nickname}
                onChange={handleChangeBoardForm('nickname')}
                className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
              />
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                name="title"
                placeholder={t('Board.placeholder.title') as string}
                value={boardText.title}
                onChange={handleChangeBoardForm('title')}
                className="w-96 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
              />
            </div>
            <div className="flex justify-end mb-2">
              <select
                onChange={handleChangeCategory}
                className="max-w-xs select select-secondary select-xs text-accent-content mx-3"
                value={boardPageState.boardCategory}
              >
                <option disabled value="0">
                  {t('BoardPage.Category.Category')}
                </option>
                <option value="STOCK">{t('BoardPage.Category.STOCK')}</option>
                <option value="LIFE">{t('BoardPage.Category.LIFE')}</option>
                <option value="QA">{t('BoardPage.Category.QA')}</option>
                <option
                  disabled={memberRole != 'ADMIN' && memberRole != 'STAFF'}
                  value="NOTICE"
                >
                  {t('BoardPage.Category.NOTICE')}
                </option>
              </select>
              <button
                onClick={onClickCancel}
                className="btn btn-xs btn-ghost mr-1"
              >
                {t('Common.Cancel')}
              </button>
              {isErrorRegister || isErrorModify ? (
                <div className="ml-2.5 mr-3">
                  <MaterialSymbolError size={19} />
                </div>
              ) : isSuccessRegister || isSuccessModify ? (
                <div className="ml-2.5 mr-3">
                  <MaterialSymbolSuccess size={19} />
                </div>
              ) : (
                <button
                  disabled={
                    boardPageState.boardCategory == '0' ||
                    !regexFinal.test(boardText.nickname) ||
                    !regexFinal.test(boardText.title) ||
                    !boardText.preview
                  }
                  onClick={onClickSave}
                  className="btn btn-xs btn-accent"
                >
                  {t('Common.Save')}
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-start mb-2 gap-2"></div>
            <div className="flex justify-end mb-2 mr-24 gap-2">
              <input
                type="text"
                name="tag1"
                placeholder={t('Board.placeholder.tag1') as string}
                value={boardText.tag1 ?? ''}
                onChange={handleChangeBoardForm('tag1')}
                className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
              />
              <input
                type="text"
                name="tag2"
                placeholder={t('Board.placeholder.tag2') as string}
                value={boardText.tag2 ?? ''}
                onChange={handleChangeBoardForm('tag2')}
                className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
              />
              <input
                type="text"
                name="tag3"
                placeholder={t('Board.placeholder.tag3') as string}
                value={boardText.tag3 ?? ''}
                onChange={handleChangeBoardForm('tag3')}
                className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
              />
            </div>
          </div>
        </>
      ) : (
        // <- boardPageState.showBoardEditor == true
        // boardPageState.showBoardEditor == false ->
        <>
          <div className="flex justify-between">
            <div className="flex justify-start mb-2 gap-2">
              <i className="ri-user-line ri-1x"></i>
              <button
                className={
                  memberId == boardDTO?.memberId
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
                    boardDTO?.boardCategory as
                      | 'STOCK'
                      | 'LIFE'
                      | 'QA'
                      | 'NOTICE'
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
                      like == null
                        ? 'invisible -mt-1 mr-1'
                        : 'visible -mt-1 mr-1'
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
        </>
        // <- boardPageState.showBoardEditor == false
      )}
      <Editor
        onChange={handleEditorChange}
        initialContent={
          boardPageState.showBoardEditor
            ? boardText.content
            : JSON.parse(boardDTO?.content as string)
        }
        editorRef={boardEditorRef}
        editable={boardPageState.showBoardEditor}
      />
      {!boardPageState.showBoardEditor && (
        // boardPageState.showBoardEditor == false ->
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
            <div hidden={memberId != boardDTO?.memberId || confirmDeleteBoard}>
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
            <div hidden={memberId != boardDTO?.memberId || !confirmDeleteBoard}>
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
        // <- boardPageState.showBoardEditor == false
      )}
      <div hidden={boardPageState.showBoardEditor}>
        <ReplyList
          panelId={panelId}
          memberId={memberId}
          replyDTOList={replyDTOList}
          setBoardDTOList={setBoardDTOList}
          setReplyDTOList={setReplyDTOList}
        />
      </div>
    </div>
  );
};

export default React.memo(BoardDetail);
