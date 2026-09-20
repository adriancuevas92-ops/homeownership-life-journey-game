import BootScene from './scenes/BootScene.js';
import DebugOverlayScene from './scenes/DebugOverlayScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import SynopsisScene from './scenes/SynopsisScene.js';
import ConversationScene from './scenes/ConversationScene.js';
import SpecialCircumstanceScene from './scenes/SpecialCircumstanceScene.js';
import DemographicContextScene from './scenes/DemographicContextScene.js';
import KitchenTablePreEndingScene from './scenes/KitchenTablePreEndingScene.js';
import SchoolTestScene from './scenes/SchoolTestScene.js';
import GraduateAdvantageScene from './scenes/GraduateAdvantageScene.js';
import DropoutDisadvantageScene from './scenes/DropoutDisadvantageScene.js';
import CollegeTestScene from './scenes/CollegeTestScene.js';
import PathStatsScene from './scenes/PathStatsScene.js';
import PackingHouseScene from './scenes/PackingHouseScene.js';
import MilitaryDrillScene from './scenes/MilitaryDrillScene.js';
import PathConsequenceScene from './scenes/PathConsequenceScene.js';
import CareerAdvancementScene from './scenes/CareerAdvancementScene.js';
import JackpotTestScene from './scenes/JackpotTestScene.js';
import ComicScene from './scenes/ComicScene.js';
import OverworldScene from './scenes/OverworldScene.js';
import EndingScene from './scenes/EndingScene.js';
import sceneConfigs from './data/scenes.js';
import overworldConfigs from './data/overworldScreens.js';
import introConversationConfig from './data/introConversation.js';
import baselineWorldConfigs from './data/baselineWorld.js';
import kitchenTableConfigs from './data/kitchenTableBeats.js';
import adulthoodWorldConfigs from './data/adulthoodWorld.js';
import pathStatsConfigs from './data/pathStats.js';
import careerAdvancementConfigs from './data/careerAdvancementPages.js';

const comicScenes = sceneConfigs.map((config) => new ComicScene(config));
const overworldScenes = overworldConfigs.map((config) => new OverworldScene(config));
const baselineScenes = baselineWorldConfigs.map((config) => new ComicScene(config));
const kitchenTableScenes = kitchenTableConfigs.map((config) => new ConversationScene(config));
const adulthoodWorldScenes = adulthoodWorldConfigs.map((config) => new ComicScene(config));
const pathStatsScenes = pathStatsConfigs.map((config) => new PathStatsScene(config));
const careerAdvancementScenes = careerAdvancementConfigs.map((config) => new CareerAdvancementScene(config));

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#1a1a1a',
  scene: [
    new BootScene(),
    new DebugOverlayScene(),
    new CharacterSelectScene(),
    new SynopsisScene(),
    ...baselineScenes,
    new ConversationScene(introConversationConfig),
    new SpecialCircumstanceScene(),
    new DemographicContextScene(),
    ...comicScenes,
    ...kitchenTableScenes,
    new KitchenTablePreEndingScene(),
    new SchoolTestScene(),
    new GraduateAdvantageScene(),
    new DropoutDisadvantageScene(),
    ...adulthoodWorldScenes,
    ...pathStatsScenes,
    new CollegeTestScene(),
    new PackingHouseScene(),
    new MilitaryDrillScene(),
    new PathConsequenceScene(),
    ...careerAdvancementScenes,
    new JackpotTestScene(),
    ...overworldScenes,
    new EndingScene(),
  ],
};

window.game = new Phaser.Game(config);
