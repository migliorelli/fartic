import { createRoom } from "@/actions/room";
import useAxios from "@/hooks/use-axios";
import { Theme } from "@/models/game";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";
import Modal from "../modal/Modal";
import Switch from "../switch/Switch";
import classes from "./CreateRoomModal.module.css";

const totalPlayers = [5, 6, 7, 8, 9, 10, 15, 20, 30, 50];
const pointsToWin = [70, 100, 120, 150, 180, 240, 360, 480];

const CreateRoomModal = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: themes,
    loading,
    error,
    refetch,
  } = useAxios<Theme[]>("/themes/getall", modalOpen);

  const [playerLimit, setPlayerLimit] = useState(totalPlayers[0]);
  const [points, setPoints] = useState(pointsToWin[0]);
  const [themeId, setThemeId] = useState(themes?.at(0)?.id || 1);
  const [visible, setVisible] = useState(false);
  const [formError, setFormError] = useState<null | string>(null);

  const resetValues = () => {
    setPlayerLimit(totalPlayers[0]);
    setPoints(pointsToWin[0]);
    setVisible(false);
    setThemeId(themes?.at(0)?.id || 1);
    setFormError(null);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleRequestClose = () => {
    setModalOpen(false);
  };

  const handleSwitchChange = () => {
    setVisible((prev) => !prev);
  };

  const handlePlayersChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPlayerLimit(Number(event.target.value));
  };

  const handlePointsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPoints(Number(event.target.value));
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setThemeId(Number(event.target.value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await createRoom({
      points,
      themeId,
      playerLimit,
      visible,
    });
    if (response?.error) {
      setFormError(response.error);
    } else {
      navigate(`/rooms/${response.room!.publicId}`);
    }
  };

  return (
    <>
      <button className="btn btn-outline" onClick={handleOpenModal}>
        Create room
      </button>
      <Modal
        open={modalOpen}
        onRequestClose={handleRequestClose}
        onAfterOpen={resetValues}
        title="Create room"
      >
        {loading && (
          <div className={classes.loading}>
            <LoadingSpinner size={80} borderSize={7.5} />
          </div>
        )}
        {!loading && error && (
          <div className={classes.error}>
            <div>
              <div>Something went wrong.</div>
              <div>{error}</div>
            </div>
            <button className="btn btn-outline" onClick={refetch}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.doubleControllers}>
              <div className="controller">
                <label className="label" htmlFor="totalPlayers">
                  Total players
                </label>
                <select
                  name="totalPlayers"
                  id="totalPlayers"
                  className="select"
                  value={playerLimit}
                  onChange={handlePlayersChange}
                >
                  {totalPlayers.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="controller">
                <label className="label" htmlFor="pointsToWin">
                  Points to win
                </label>
                <select
                  name="pointsToWin"
                  id="pointsToWin"
                  className="select"
                  value={points}
                  onChange={handlePointsChange}
                >
                  {pointsToWin.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="controller">
              <label className="label" htmlFor="themes">
                Theme
              </label>
              <select
                name="themes"
                id="themes"
                className="select"
                value={themeId}
                onChange={handleThemeChange}
              >
                {themes &&
                  themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name[0].toLocaleUpperCase()}
                      {theme.name.substring(1)}
                    </option>
                  ))}
              </select>
            </div>
            <div className="controller">
              <Switch
                checked={visible}
                onChange={handleSwitchChange}
                label="Visible room"
              />
            </div>
            <button className="btn">Play</button>
            {formError && <span className="error">{formError}</span>}{" "}
          </form>
        )}
      </Modal>
    </>
  );
};

export default CreateRoomModal;
