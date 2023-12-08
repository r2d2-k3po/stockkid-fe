import React, {FC, MouseEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {BoardDTO} from '../BoardPage';
import {DateTime} from 'luxon';

type BoardProps = {
  memberId?: string | null;
  memberRole: string | null;
  panelId: string;
  mode: 'preview' | 'detail';
  boardDTO?: BoardDTO;
  setCurrentBoard?: React.Dispatch<React.SetStateAction<string | null>>;
};

const Board: FC<BoardProps> = ({
  memberId,
  memberRole,
  panelId,
  mode,
  boardDTO,
  setCurrentBoard
}) => {
  const {t} = useTranslation();

  const onClickToggleDetail = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (mode == 'preview') {
        setCurrentBoard?.(boardDTO?.boardId as string);
      } else if (mode == 'detail') {
        setCurrentBoard?.(null);
      }
    },
    [boardDTO?.boardId, mode, setCurrentBoard]
  );

  return (
    <div className="border-b border-warning my-2 mr-2">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-user-line ri-1x"></i>
          <button className="text-sm text-info btn-ghost rounded -mt-1 px-0.5">
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
              boardDTO?.regDate.split('.')[0] as string
            ).toFormat('HH:mm yyyy-MM-dd')}
          </div>
          <div className="text-xs text-info text-center w-16 mx-2 border-[1px] border-secondary rounded-lg my-0.5">
            {t(`BoardPage.Category.${boardDTO?.boardCategory}`)}
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
      {mode == 'preview' && (
        <button
          onClick={onClickToggleDetail}
          className="mb-2 line-clamp-1 text-sm text-info hover:text-accent"
        >
          {boardDTO?.preview}
          {/*<EditorReadOnly*/}
          {/*  initialContent={JSON.parse(boardDTO?.preview as string)}*/}
          {/*/>*/}
        </button>
      )}
      {mode == 'detail' && (
        <button
          onClick={onClickToggleDetail}
          className="mb-2 line-clamp-1 text-sm text-info hover:text-accent"
        >
          {mode}
        </button>
      )}
    </div>
  );
};

export default React.memo(Board);
