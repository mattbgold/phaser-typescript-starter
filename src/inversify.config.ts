import "reflect-metadata";

export abstract class ContainerKeys {
	static CTRL_TITLE: string = 'TitleControllers';
	static CTRL_GAME: string = 'GameControllers';
	static CONFIG: string = 'config';
}

import {Container} from 'inversify';
import {GameController} from "./controllers/game/controller";
import {InputController} from "./controllers/shared/input/controller";
import {BaseController} from "./controllers/base";
import {GameConfig, getConfig} from "./config";
import {GameSubject} from "./services/subject/game";
import {InputSubject} from "./services/subject/input";
import {PlayerController} from "./controllers/game/player/controller";
import {AsteroidsController} from "./controllers/game/asteroids/controller";

let container = new Container();

container.bind<GameConfig>('config').toConstantValue(getConfig());

// controllers (order here determines order of lifecycle fn calls)
container.bind<BaseController>(ContainerKeys.CTRL_TITLE).to(InputController).inSingletonScope();

container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(InputController).inSingletonScope();
container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(GameController).inSingletonScope();
container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(PlayerController).inSingletonScope();
container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(AsteroidsController).inSingletonScope();

// subjects
container.bind<GameSubject>(GameSubject).toSelf().inSingletonScope();
container.bind<InputSubject>(InputSubject).toSelf().inSingletonScope();

export default container;