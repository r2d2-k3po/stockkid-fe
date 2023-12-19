import React, {FC} from 'react';
import {EditorRef, ReplyDTO} from '../BoardPage';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../../app/hooks';
import ReplyEditor from './ReplyEditor';

type ReplyListProps = {
  memberId: string | null;
  panelId: string;
  boardId: string;
  replyDTOList: ReplyDTO[] | null | undefined;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  replyEditorRef: React.MutableRefObject<EditorRef | null>;
};

const ReplyList: FC<ReplyListProps> = ({
  memberId,
  panelId,
  boardId,
  replyDTOList,
  loadBoard,
  replyEditorRef
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="m-2 h-36 border-2">ReplyList</div>
      {/*<div className="m-2 mt-5 h-48">*/}
      {/*  <ReplyEditor*/}
      {/*    panelId={panelId}*/}
      {/*    replyEditorRef={replyEditorRef}*/}
      {/*    loadBoard={loadBoard}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
};

export default React.memo(ReplyList);
