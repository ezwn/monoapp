// str

const strUpperFirstChar = (str) =>
  str.substring(0, 1).toUpperCase() + str.substring(1);

const strLowerFirstChar = (str) =>
  str.substring(0, 1).toLowerCase() + str.substring(1);

const strArrayTrimEach = (stringArray) => stringArray.map((str) => str.trim());

// TS code

const tsCodeRemoveModifiers = (x) =>
  x.replace("private", "").replace("protected", "").replace("readonly", "");

const tsCodeSplitVarnameAndType = (declarationStr) =>
  strArrayTrimEach(declarationStr.split(":"));

const tsDeclarationVarname = (declaration) => declaration[0];
const tsType = (declaration) => declaration[1];

// Evooq

const evooqFactoryInstanciationAffectation =
  (separator = ",") =>
  (x) =>
    `${x} = ${x}Factory()${separator}`;

// process

const result = `    protected readonly utilsService: UtilsService,
    translateService: TranslateService,
    authService: AuthService,
    periodPipe: PeriodPipe,
    resourceService: ResourceService,
    private organizationUnit: OrganizationService,
    holidayCalendarApi: HolidayCalendarWrapper,
    private modalService: NzModalService,
    protected marketDataApi: MarketDataWrapper,
    protected modelService: NewFormModelService
`
  .split("\n")
  .map(tsCodeRemoveModifiers)
  .map(tsCodeSplitVarnameAndType)
  .map(tsDeclarationVarname)
  // .map((x) => `${x},`) // ${x}
  // .map((x) => `${x}?: ${stringUpperFirstChar(x)};`)
  .map(evooqFactoryInstanciationAffectation())
  .join("\n");

console.log(result);
