import "reflect-metadata";

export abstract class ContainerKeys {
	static CTRL_TITLE: string = 'TitleControllers';
	static CTRL_GAME: string = 'GameControllers';
	static CONFIG: string = 'config';
}

import {Container, interfaces} from 'inversify';
import {GameController} from "./controllers/game/controller";
import {InputController} from "./controllers/shared/input/controller";
import {BaseController} from "./controllers/base";
import {GameConfig, getConfig} from "./config";
import Factory = interfaces.Factory;
import {GameSubject} from "./services/subject/game";
import {InputSubject} from "./services/subject/input";
import {SystemSubject} from "./services/subject/system";
import {SystemController} from "./controllers/shared/system/controller";

let container = new Container();

container.bind<GameConfig>('config').toConstantValue(getConfig());

// controllers (order here determines order of lifecycle fn calls)
container.bind<BaseController>(ContainerKeys.CTRL_TITLE).to(InputController).inSingletonScope();
container.bind<BaseController>(ContainerKeys.CTRL_TITLE).to(SystemController).inSingletonScope();

container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(InputController).inSingletonScope();
container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(SystemController).inSingletonScope();
container.bind<BaseController>(ContainerKeys.CTRL_GAME).to(GameController).inSingletonScope();

// subjects
container.bind<GameSubject>(GameSubject).toSelf().inSingletonScope();
container.bind<InputSubject>(InputSubject).toSelf().inSingletonScope();
container.bind<SystemSubject>(SystemSubject).toSelf().inSingletonScope();

export default container;