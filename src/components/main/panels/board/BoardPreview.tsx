import React, {FC, MouseEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {BoardDTO} from '../BoardPage';
import {DateTime} from 'luxon';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useAppDispatch} from '../../../../app/hooks';

type BoardPreviewProps = {
  memberId: string | null;
  panelId: string;
  boardDTO: BoardDTO;
};

const BoardPreview: FC<BoardPreviewProps> = ({memberId, panelId, boardDTO}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const onClickToDetail = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          boardId: boardDTO?.boardId
        }
      };
      dispatch(updatePanelState(payload));
    },
    [boardDTO?.boardId, panelId, dispatch]
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
          targetPage: 1,
          boardId: null
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
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
          <div
            onClick={onClickToDetail}
            className="text-md text-info ml-16 hover:text-accent"
          >
            {boardDTO?.title}
          </div>
        </div>
        <div className="flex justify-end mb-2">
          <i className="ri-time-line ri-1x"></i>
          <div className="text-sm text-info mx-1">
            {DateTime.fromISO(
              boardDTO?.regDate.split('.')[0] as string
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
      <div
        onClick={onClickToDetail}
        className="mb-2 line-clamp-1 text-sm text-info hover:text-accent"
      >
        {boardDTO?.preview}
      </div>
    </div>
  );
};

export default React.memo(BoardPreview);
