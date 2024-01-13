import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {DateTime} from 'luxon';
import Editor from './Editor';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import {EditorRef, IdDTO, ReplyDTO} from './BoardDetail';
import {
  ReplySaveRequest,
  useDeleteReplyMutation,
  useLikeReplyMutation,
  useModifyReplyMutation,
  useRegisterReplyMutation
} from '../../../../app/api';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {
  BoardPageState,
  deletedContent
} from '../../../../app/constants/panelInfo';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useTranslation} from 'react-i18next';
import {BoardDTO} from '../BoardPage';
import {RemirrorContentType, RemirrorJSON} from 'remirror';

type ReplyText = {
  nickname: string;
  preview: string | undefined;
  content: RemirrorContentType | undefined;
};

type ReplyProps = {
  memberId: string | null;
  panelId: string;
  parentNickname: string | null;
  replyDTO: ReplyDTO;
  replyCount: number | undefined;
  setBoardDTOList: React.Dispatch<
    React.SetStateAction<BoardDTO[] | null | undefined>
  >;
  setReplyDTOList: React.Dispatch<
    React.SetStateAction<ReplyDTO[] | null | undefined>
  >;
};

const Reply: FC<ReplyProps> = ({
  memberId,
  panelId,
  parentNickname,
  replyDTO,
  replyCount,
  setBoardDTOList,
  setReplyDTOList
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{2,30}$/;

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const replyEditorRef = useRef<EditorRef | null>(null);

  const [
    requestReplyDelete,
    {isSuccess: isSuccessDelete, isError: isErrorDelete, reset: resetDelete}
  ] = useDeleteReplyMutation();

  const [
    requestReplyLike,
    {isSuccess: isSuccessLike, isError: isErrorLike, reset: resetLike}
  ] = useLikeReplyMutation();

  const [
    requestReplyRegister,
    {
      data: dataReplyRegister,
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      reset: resetRegister
    }
  ] = useRegisterReplyMutation();

  const [
    requestReplyModify,
    {isSuccess: isSuccessModify, isError: isErrorModify, reset: resetModify}
  ] = useModifyReplyMutation();

  const [confirmDeleteReply, setConfirmDeleteReply] = useState<boolean>(false);

  const [like, setLike] = useState<boolean | null>(null);

  const [likeUpdated, setLikeUpdated] = useState<boolean>(false);

  const [replyText, setReplyText] = useState<ReplyText>({
    nickname: boardPageState.nickname,
    preview: boardPageState.preview,
    content: boardPageState.content
  });

  // boardPageState.showReplyEditor === false ->

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
          id: replyDTO.replyId as string,
          number: like === true ? 1 : -1
        };
        await requestReplyLike(likeRequest);
      } catch (err) {
        console.log(err);
      }
    },
    [replyDTO.replyId, like, requestReplyLike]
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

  const enableReplyEditorToModify = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          showReplyEditor: true,
          parentId: replyDTO.parentId,
          replyId: replyDTO.replyId
        }
      };
      dispatch(updatePanelState(payload));
      setReplyText({
        nickname: replyDTO?.nickname as string,
        preview: undefined,
        content: JSON.parse(replyDTO?.content as string)
      });
    },
    [
      dispatch,
      panelId,
      replyDTO.parentId,
      replyDTO.replyId,
      replyDTO.nickname,
      replyDTO.content
    ]
  );

  const deleteReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteReply(true);
  }, []);

  const cancelDeleteReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteReply(false);
  }, []);

  const reallyDeleteReply = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await requestReplyDelete(replyDTO.replyId as string);
      } catch (err) {
        console.log(err);
      }
    },
    [requestReplyDelete, replyDTO.replyId]
  );

  useEffect(() => {
    if (isSuccessDelete || isErrorDelete) {
      const id = setTimeout(() => {
        if (isSuccessDelete) {
          replyEditorRef.current?.setContent(JSON.parse(deletedContent));
          setReplyDTOList((replyDTOList) =>
            replyDTOList?.map((rDTO) => {
              if (rDTO.replyId === replyDTO.replyId) {
                return {
                  ...rDTO,
                  content: deletedContent
                };
              } else {
                return rDTO;
              }
            })
          );
          setConfirmDeleteReply(false);
        }
        resetDelete();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    replyDTO.replyId,
    setReplyDTOList,
    resetDelete
  ]);

  useEffect(() => {
    if (isSuccessLike) {
      const number = like === true ? 1 : -1;
      const likeCount = (replyDTO?.likeCount as number) + number;
      setReplyDTOList((replyDTOList) =>
        replyDTOList?.map((rDTO) => {
          if (rDTO.replyId === replyDTO.replyId) {
            return {
              ...rDTO,
              likeCount: likeCount
            };
          } else {
            return rDTO;
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
    replyDTO.likeCount,
    replyDTO.replyId,
    setReplyDTOList,
    resetLike
  ]);

  // <- boardPageState.showReplyEditor === false

  // boardPageState.showReplyEditor === true ->

  const needSaveText = useRef(false);

  const handleChangeNickname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        setReplyText((replyText) => {
          return {
            ...replyText,
            nickname: e.target.value.trim()
          };
        });
        needSaveText.current = true;
      }
    },
    []
  );

  const handleReplyEditorChange = useCallback((json: RemirrorJSON) => {
    setReplyText((replyText) => {
      return {
        ...replyText,
        preview: replyEditorRef.current?.getText({lineBreakDivider: ' '}),
        content: json
      };
    });
    needSaveText.current = true;
  }, []);

  const resetReplyEditorState = useCallback(() => {
    needSaveText.current = false;
    const payload = {
      panelId: panelId,
      panelState: {
        showReplyEditor: false,
        replyId: null,
        parentId: null,
        nickname: localStorage.getItem('nickname') || '',
        preview: undefined,
        content: undefined
      }
    };
    dispatch(updatePanelState(payload));
    setReplyText({
      nickname: localStorage.getItem('nickname') || '',
      preview: undefined,
      content: undefined
    });
  }, [dispatch, panelId]);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (replyDTO.replyId == null) {
        replyEditorRef.current?.clearContent();
      } else {
        replyEditorRef.current?.setContent(
          JSON.parse(replyDTO?.content as string)
        );
      }
      resetReplyEditorState();
    },
    [replyDTO.replyId, replyDTO.content, resetReplyEditorState]
  );

  const onClickSave = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        localStorage.setItem('nickname', replyText.nickname);
        const replySaveRequest: ReplySaveRequest = {
          boardId: boardPageState.boardId as string,
          replyId: replyDTO.replyId,
          parentId: replyDTO.parentId,
          nickname: replyText.nickname,
          content: JSON.stringify(replyText.content)
        };
        if (replyDTO.replyId == null) {
          await requestReplyRegister(replySaveRequest);
        } else {
          await requestReplyModify(replySaveRequest);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      boardPageState.boardId,
      replyDTO.replyId,
      replyDTO.parentId,
      replyText.nickname,
      replyText.content,
      requestReplyRegister,
      requestReplyModify
    ]
  );

  useEffect(() => {
    if (isSuccessRegister || isErrorRegister) {
      const id = setTimeout(() => {
        if (isSuccessRegister) {
          setBoardDTOList((boardDTOList) =>
            boardDTOList?.map((bDTO) => {
              if (bDTO.boardId === boardPageState.boardId) {
                return {
                  ...bDTO,
                  replyCount: (replyCount as number) + 1
                };
              } else {
                return bDTO;
              }
            })
          );
          const replyId = (dataReplyRegister?.apiObj as IdDTO)?.id;
          const now = DateTime.now().toISO();
          const newReplyDTO: ReplyDTO = {
            replyId: replyId,
            parentId: replyDTO.parentId,
            memberId: replyDTO.memberId,
            nickname: replyText.nickname,
            content: JSON.stringify(replyText.content),
            likeCount: 0,
            regDate: now,
            modDate: now
          };
          setReplyDTOList((replyDTOList) => {
            return [...(replyDTOList as ReplyDTO[]), newReplyDTO];
          });
          resetReplyEditorState();
        }
        resetRegister();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    boardPageState.boardId,
    replyCount,
    setBoardDTOList,
    dataReplyRegister?.apiObj,
    replyDTO.memberId,
    replyDTO.parentId,
    replyText.nickname,
    replyText.content,
    isSuccessRegister,
    isErrorRegister,
    setReplyDTOList,
    resetReplyEditorState,
    resetRegister
  ]);

  useEffect(() => {
    if (isSuccessModify || isErrorModify) {
      const id = setTimeout(() => {
        if (isSuccessModify) {
          const now = DateTime.now().toISO();
          const newReplyDTO: ReplyDTO = {
            replyId: replyDTO.replyId,
            parentId: replyDTO.parentId,
            memberId: replyDTO.memberId,
            nickname: replyText.nickname,
            content: JSON.stringify(replyText.content),
            likeCount: replyDTO.likeCount,
            regDate: replyDTO.regDate,
            modDate: now
          };
          setReplyDTOList((replyDTOList) =>
            replyDTOList?.map((rDTO) => {
              if (rDTO.replyId === replyDTO.replyId) {
                return newReplyDTO;
              } else {
                return rDTO;
              }
            })
          );
          resetReplyEditorState();
        }
        resetModify();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    replyDTO.replyId,
    replyDTO.memberId,
    replyDTO.parentId,
    replyText.nickname,
    replyText.content,
    replyDTO.likeCount,
    replyDTO.regDate,
    isSuccessModify,
    isErrorModify,
    setReplyDTOList,
    resetReplyEditorState,
    resetModify
  ]);

  // disable ReplyEditor when logged out
  useEffect(() => {
    if (
      memberId == null &&
      boardPageState.showReplyEditor &&
      boardPageState.replyId === replyDTO.replyId
    ) {
      resetReplyEditorState();
    }
  }, [
    memberId,
    boardPageState.showReplyEditor,
    boardPageState.replyId,
    replyDTO.replyId,
    resetReplyEditorState
  ]);

  // settings for unintentional unmounting
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  // setContent only when mounting with ReplyEditor open (empty dependency list)
  useEffect(() => {
    if (
      boardPageState.showReplyEditor &&
      replyDTO.replyId === boardPageState.replyId &&
      mounted.current
    ) {
      replyEditorRef.current?.setContent(
        replyText.content as RemirrorContentType
      );
    }
  }, []);

  // save ReplyEditor info when unintentionally unmounting
  useEffect(() => {
    return () => {
      if (
        boardPageState.showReplyEditor &&
        replyDTO.replyId === boardPageState.replyId &&
        !mounted.current &&
        needSaveText.current
      ) {
        const payload = {
          panelId: panelId,
          panelState: replyText
        };
        dispatch(updatePanelState(payload));
        needSaveText.current = false;
      }
    };
  }, [
    panelId,
    dispatch,
    boardPageState.showReplyEditor,
    boardPageState.replyId,
    replyDTO.replyId,
    replyText
  ]);

  // <- boardPageState.showReplyEditor === true

  if (
    replyDTO.replyId == null &&
    (!boardPageState.showReplyEditor ||
      replyDTO.replyId != boardPageState.replyId)
  ) {
    console.log('reply return null');
    return null;
  }

  return (
    <div className="border-t border-info pt-1">
      {boardPageState.showReplyEditor &&
      boardPageState.replyId === replyDTO.replyId ? (
        // boardPageState.showReplyEditor === true ->
        <div className="flex justify-between">
          <div className="flex justify-start mb-2 gap-2">
            <i className="ri-user-line ri-1x"></i>
            <input
              type="text"
              name="nickname"
              placeholder={t('Board.placeholder.nickname') as string}
              value={replyText.nickname}
              onChange={handleChangeNickname}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          </div>
          <div className="flex justify-end mb-2">
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
                  !regexFinal.test(replyText.nickname) || !replyText.preview
                }
                onClick={onClickSave}
                className="btn btn-xs btn-accent"
              >
                {t('Common.Save')}
              </button>
            )}
          </div>
        </div>
      ) : (
        // <- boardPageState.showReplyEditor === true
        // boardPageState.showReplyEditor === false ->
        <div className="flex justify-between">
          <div className="flex justify-start gap-2">
            {parentNickname && (
              <div className="text-sm">
                <span>{parentNickname}</span>
                <i className="ri-reply-line ri-1x"></i>
              </div>
            )}
            <i className="ri-user-line ri-1x"></i>
            <button
              className={
                memberId === replyDTO.memberId
                  ? 'text-sm text-primary btn-ghost rounded -mt-1 px-0.5 mr-3'
                  : 'text-sm text-info btn-ghost rounded -mt-1 px-0.5 mr-3'
              }
            >
              {replyDTO?.nickname}
            </button>
            <i className="ri-star-line ri-1x"></i>
            <div className="text-sm text-info">{replyDTO?.likeCount}</div>
            <div hidden={memberId == null}>
              <div className="flex gap-1">
                <button
                  onClick={updateLike}
                  disabled={likeUpdated}
                  className={
                    like === null
                      ? 'btn btn-xs btn-circle btn-outline btn-warning invisible mr-1'
                      : 'btn btn-xs btn-circle btn-outline btn-warning visible mr-1'
                  }
                >
                  <i className="ri-arrow-left-double-line ri-1x"></i>
                </button>
                <button
                  disabled={likeUpdated}
                  onClick={onClickLike}
                  className={
                    like === true
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
                    like === false
                      ? 'btn btn-xs btn-circle btn-outline btn-error btn-active'
                      : 'btn btn-xs btn-circle btn-outline btn-error'
                  }
                >
                  <i className="ri-thumb-down-line ri-1x"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <i className="ri-time-line ri-1x"></i>
            <div className="text-sm text-info mx-1">
              {DateTime.fromISO(
                (replyDTO?.regDate as string).split('.')[0] as string
              ).toFormat('HH:mm yyyy-MM-dd')}
            </div>
          </div>
        </div>
        // <- boardPageState.showReplyEditor === false
      )}
      <div
        className={
          boardPageState.showReplyEditor &&
          boardPageState.replyId === replyDTO.replyId
            ? 'mb-2'
            : ''
        }
      >
        <Editor
          onChange={handleReplyEditorChange}
          initialContent={
            boardPageState.showReplyEditor &&
            boardPageState.replyId === replyDTO.replyId
              ? replyText.content
              : JSON.parse(replyDTO?.content as string)
          }
          editorRef={replyEditorRef}
          editable={
            boardPageState.showReplyEditor &&
            boardPageState.replyId === replyDTO.replyId
          }
        />
      </div>
      {!(
        boardPageState.showReplyEditor &&
        boardPageState.replyId === replyDTO.replyId
      ) && (
        // boardPageState.showReplyEditor === false ->
        <div className="flex justify-between">
          <button
            disabled={memberId == null || boardPageState.showReplyEditor}
            onClick={enableReplyEditor(replyDTO.replyId)}
            className="btn btn-xs btn-circle btn-outline btn-warning m-1"
          >
            <i className="ri-reply-line ri-1x"></i>
          </button>
          <div className="justify-end">
            <div hidden={memberId != replyDTO.memberId || confirmDeleteReply}>
              <button
                disabled={boardPageState.showReplyEditor}
                className="btn btn-xs btn-circle btn-outline btn-accent m-1"
                onClick={enableReplyEditorToModify}
              >
                <i className="ri-edit-2-line ri-1x"></i>
              </button>
              <button
                disabled={boardPageState.showReplyEditor}
                className="btn btn-xs btn-circle btn-outline btn-error m-1"
                onClick={deleteReply}
              >
                <i className="ri-delete-bin-line ri-1x"></i>
              </button>
            </div>
            <div hidden={memberId != replyDTO.memberId || !confirmDeleteReply}>
              <button
                onClick={cancelDeleteReply}
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
                  onClick={reallyDeleteReply}
                  className="btn btn-xs btn-accent"
                >
                  {t('Common.Delete')}
                </button>
              )}
            </div>
          </div>
        </div>
        // <- boardPageState.showReplyEditor === false
      )}
    </div>
  );
};

export default React.memo(Reply);
