-- ============================================================
-- BANCO ANDINO - 02_DML_CATALOGOS.SQL
-- Catálogos y dimensiones base — ejecutar 1 sola vez
-- Fuente: boletines SBS públicos + normas SBS vigentes
-- Todos los datos son ficticios o de dominio público
-- PostgreSQL 15+ | Base de datos: banco_andino
-- ============================================================

BEGIN;

-- ============================================================
-- BLOQUE 1: PAÍSES
-- ============================================================
INSERT INTO DPAIS (CODPAIS, DESPAIS) VALUES
('PER','Perú'),('USA','Estados Unidos'),('ESP','España'),
('ARG','Argentina'),('COL','Colombia'),('BOL','Bolivia'),
('ECU','Ecuador'),('CHL','Chile'),('BRA','Brasil'),
('MEX','México'),('JPN','Japón'),('DEU','Alemania'),
('FRA','Francia'),('GBR','Reino Unido'),('ITA','Italia'),
('CHN','China'),('IND','India'),('RUS','Rusia'),
('CAN','Canadá'),('AUS','Australia');

-- ============================================================
-- BLOQUE 2: TIPO DE DOCUMENTO DE IDENTIDAD
-- ============================================================
INSERT INTO DTIPODOCUMENTOIDENTIDAD (CODTIPODOCUMENTOIDENTIDAD, DESTIPODOCUMENTOIDENTIDAD) VALUES
('01','DNI'),
('04','Carnet de Extranjería'),
('06','RUC'),
('07','Pasaporte'),
('11','Partida de Nacimiento');

-- ============================================================
-- BLOQUE 3: TIPO DE VÍA
-- ============================================================
INSERT INTO DTIPOVIA (CODTIPOVIA, DESTIPOVIA) VALUES
('AV','Avenida'),
('JR','Jirón'),
('CA','Calle'),
('PS','Pasaje'),
('UR','Urbanización'),
('CO','Condominio'),
('AA','Asociación'),
('CP','Carretera'),
('PJ','Pasaje');

-- ============================================================
-- BLOQUE 4: CLASE PERSONA
-- ============================================================
INSERT INTO DCLASEPERSONA (CODCLASEPERSONA, DESCLASEPERSONA) VALUES
('01','Persona Natural'),
('02','Persona Jurídica'),
('03','Persona Natural con Negocio');

-- ============================================================
-- BLOQUE 5: SECTOR ECONÓMICO
-- ============================================================
INSERT INTO DSECTORECONOMICO (CODSECTORECONOMICO, DESSECTORECONOMICO) VALUES
('A','Agricultura, Ganadería, Silvicultura y Pesca'),
('B','Explotación de Minas y Canteras'),
('C','Industrias Manufactureras'),
('D','Suministro de Electricidad, Gas y Agua'),
('E','Construcción'),
('F','Comercio al por Mayor y al por Menor'),
('G','Transporte y Almacenamiento'),
('H','Alojamiento y Servicio de Comidas'),
('I','Información y Comunicaciones'),
('J','Actividades Financieras y de Seguros'),
('K','Actividades Inmobiliarias'),
('L','Actividades Profesionales y Técnicas'),
('M','Actividades Administrativas y de Apoyo'),
('N','Administración Pública'),
('O','Enseñanza'),
('P','Actividades de Salud'),
('Q','Artes, Entretenimiento y Recreación'),
('R','Otras Actividades de Servicios'),
('S','Hogares como Empleadores');

-- ============================================================
-- BLOQUE 6: ACTIVIDAD ECONÓMICA (CIIU - principales)
-- ============================================================
INSERT INTO DACTIVIDADECONOMICA (CODACTIVIDADECONOMICA, DESACTIVIDADECONOMICA, PKSECTORECONOMICO) VALUES
('0111','Cultivo de cereales excepto arroz',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='A')),
('0112','Cultivo de arroz',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='A')),
('0121','Cultivo de hortalizas y melones',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='A')),
('0141','Cría de ganado vacuno y búfalos',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='A')),
('0150','Cultivo de plantas para preparar bebidas',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='A')),
('1010','Elaboración y conservación de carne',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='C')),
('1071','Fabricación de productos de panadería',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='C')),
('1549','Fabricación de otros productos alimenticios',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='C')),
('4100','Construcción de edificios',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='E')),
('4520','Mantenimiento y reparación de vehículos',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4711','Comercio al por menor en almacenes no especializados',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4721','Comercio al por menor de alimentos en puestos de venta',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4731','Comercio al por menor de combustibles',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4741','Comercio al por menor de computadoras',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4771','Comercio al por menor de prendas de vestir',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4781','Comercio al por menor en puestos de venta de alimentos',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='F')),
('4921','Transporte urbano y suburbano de pasajeros',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='G')),
('4923','Transporte de carga por carretera',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='G')),
('5510','Actividades de alojamiento',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='H')),
('5610','Actividades de restaurantes',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='H')),
('6201','Actividades de programación informática',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='I')),
('6491','Arrendamiento financiero',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='J')),
('6810','Actividades inmobiliarias por cuenta propia',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='K')),
('8511','Educación preescolar y primaria',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='O')),
('8621','Actividades de médicos y odontólogos',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='P')),
('9601','Lavado y limpieza de prendas de tela',(SELECT PKSECTORECONOMICO FROM DSECTORECONOMICO WHERE CODSECTORECONOMICO='R'));

-- ============================================================
-- BLOQUE 7: MONEDA
-- ============================================================
INSERT INTO DMONEDA (CODMONEDA, DESMONEDA, SIMBOLO) VALUES
('SO','Soles','S/'),
('DO','Dólares Americanos','US$'),
('EU','Euros','€');

-- ============================================================
-- BLOQUE 8: TIPO DE CAMBIO (dic-2025 = 3.363 según SBS)
-- ============================================================
INSERT INTO GENT_TIPCAMBIO (FECTIPCAMBIO, NTIPCAMFIJ) VALUES
('2015-12-31', 3.4110),
('2016-12-31', 3.3560),
('2017-12-31', 3.2410),
('2018-12-31', 3.3700),
('2019-12-31', 3.3150),
('2020-12-31', 3.6210),
('2021-12-31', 3.9980),
('2022-12-31', 3.8070),
('2023-12-31', 3.7090),
('2024-12-31', 3.7540),
('2025-12-31', 3.3630);

-- ============================================================
-- BLOQUE 9: DIMENSIÓN TIEMPO — MESES 2015-2025
-- ============================================================
INSERT INTO DTIEMPOMES (PERIODOMES, MES, ANIO, DESCRIPCIONMES, BIMESTRE, TRIMESTRE, CUATRIMESTRE, SEMESTRE) VALUES
(201501,1,2015,'Enero 2015',1,1,1,1),(201502,2,2015,'Febrero 2015',1,1,1,1),(201503,3,2015,'Marzo 2015',2,1,1,1),
(201504,4,2015,'Abril 2015',2,2,1,1),(201505,5,2015,'Mayo 2015',3,2,2,1),(201506,6,2015,'Junio 2015',3,2,2,1),
(201507,7,2015,'Julio 2015',4,3,2,2),(201508,8,2015,'Agosto 2015',4,3,2,2),(201509,9,2015,'Setiembre 2015',5,3,3,2),
(201510,10,2015,'Octubre 2015',5,4,3,2),(201511,11,2015,'Noviembre 2015',6,4,3,2),(201512,12,2015,'Diciembre 2015',6,4,4,2),
(201601,1,2016,'Enero 2016',1,1,1,1),(201602,2,2016,'Febrero 2016',1,1,1,1),(201603,3,2016,'Marzo 2016',2,1,1,1),
(201604,4,2016,'Abril 2016',2,2,1,1),(201605,5,2016,'Mayo 2016',3,2,2,1),(201606,6,2016,'Junio 2016',3,2,2,1),
(201607,7,2016,'Julio 2016',4,3,2,2),(201608,8,2016,'Agosto 2016',4,3,2,2),(201609,9,2016,'Setiembre 2016',5,3,3,2),
(201610,10,2016,'Octubre 2016',5,4,3,2),(201611,11,2016,'Noviembre 2016',6,4,3,2),(201612,12,2016,'Diciembre 2016',6,4,4,2),
(201701,1,2017,'Enero 2017',1,1,1,1),(201702,2,2017,'Febrero 2017',1,1,1,1),(201703,3,2017,'Marzo 2017',2,1,1,1),
(201704,4,2017,'Abril 2017',2,2,1,1),(201705,5,2017,'Mayo 2017',3,2,2,1),(201706,6,2017,'Junio 2017',3,2,2,1),
(201707,7,2017,'Julio 2017',4,3,2,2),(201708,8,2017,'Agosto 2017',4,3,2,2),(201709,9,2017,'Setiembre 2017',5,3,3,2),
(201710,10,2017,'Octubre 2017',5,4,3,2),(201711,11,2017,'Noviembre 2017',6,4,3,2),(201712,12,2017,'Diciembre 2017',6,4,4,2),
(201801,1,2018,'Enero 2018',1,1,1,1),(201802,2,2018,'Febrero 2018',1,1,1,1),(201803,3,2018,'Marzo 2018',2,1,1,1),
(201804,4,2018,'Abril 2018',2,2,1,1),(201805,5,2018,'Mayo 2018',3,2,2,1),(201806,6,2018,'Junio 2018',3,2,2,1),
(201807,7,2018,'Julio 2018',4,3,2,2),(201808,8,2018,'Agosto 2018',4,3,2,2),(201809,9,2018,'Setiembre 2018',5,3,3,2),
(201810,10,2018,'Octubre 2018',5,4,3,2),(201811,11,2018,'Noviembre 2018',6,4,3,2),(201812,12,2018,'Diciembre 2018',6,4,4,2),
(201901,1,2019,'Enero 2019',1,1,1,1),(201902,2,2019,'Febrero 2019',1,1,1,1),(201903,3,2019,'Marzo 2019',2,1,1,1),
(201904,4,2019,'Abril 2019',2,2,1,1),(201905,5,2019,'Mayo 2019',3,2,2,1),(201906,6,2019,'Junio 2019',3,2,2,1),
(201907,7,2019,'Julio 2019',4,3,2,2),(201908,8,2019,'Agosto 2019',4,3,2,2),(201909,9,2019,'Setiembre 2019',5,3,3,2),
(201910,10,2019,'Octubre 2019',5,4,3,2),(201911,11,2019,'Noviembre 2019',6,4,3,2),(201912,12,2019,'Diciembre 2019',6,4,4,2),
(202001,1,2020,'Enero 2020',1,1,1,1),(202002,2,2020,'Febrero 2020',1,1,1,1),(202003,3,2020,'Marzo 2020',2,1,1,1),
(202004,4,2020,'Abril 2020',2,2,1,1),(202005,5,2020,'Mayo 2020',3,2,2,1),(202006,6,2020,'Junio 2020',3,2,2,1),
(202007,7,2020,'Julio 2020',4,3,2,2),(202008,8,2020,'Agosto 2020',4,3,2,2),(202009,9,2020,'Setiembre 2020',5,3,3,2),
(202010,10,2020,'Octubre 2020',5,4,3,2),(202011,11,2020,'Noviembre 2020',6,4,3,2),(202012,12,2020,'Diciembre 2020',6,4,4,2),
(202101,1,2021,'Enero 2021',1,1,1,1),(202102,2,2021,'Febrero 2021',1,1,1,1),(202103,3,2021,'Marzo 2021',2,1,1,1),
(202104,4,2021,'Abril 2021',2,2,1,1),(202105,5,2021,'Mayo 2021',3,2,2,1),(202106,6,2021,'Junio 2021',3,2,2,1),
(202107,7,2021,'Julio 2021',4,3,2,2),(202108,8,2021,'Agosto 2021',4,3,2,2),(202109,9,2021,'Setiembre 2021',5,3,3,2),
(202110,10,2021,'Octubre 2021',5,4,3,2),(202111,11,2021,'Noviembre 2021',6,4,3,2),(202112,12,2021,'Diciembre 2021',6,4,4,2),
(202201,1,2022,'Enero 2022',1,1,1,1),(202202,2,2022,'Febrero 2022',1,1,1,1),(202203,3,2022,'Marzo 2022',2,1,1,1),
(202204,4,2022,'Abril 2022',2,2,1,1),(202205,5,2022,'Mayo 2022',3,2,2,1),(202206,6,2022,'Junio 2022',3,2,2,1),
(202207,7,2022,'Julio 2022',4,3,2,2),(202208,8,2022,'Agosto 2022',4,3,2,2),(202209,9,2022,'Setiembre 2022',5,3,3,2),
(202210,10,2022,'Octubre 2022',5,4,3,2),(202211,11,2022,'Noviembre 2022',6,4,3,2),(202212,12,2022,'Diciembre 2022',6,4,4,2),
(202301,1,2023,'Enero 2023',1,1,1,1),(202302,2,2023,'Febrero 2023',1,1,1,1),(202303,3,2023,'Marzo 2023',2,1,1,1),
(202304,4,2023,'Abril 2023',2,2,1,1),(202305,5,2023,'Mayo 2023',3,2,2,1),(202306,6,2023,'Junio 2023',3,2,2,1),
(202307,7,2023,'Julio 2023',4,3,2,2),(202308,8,2023,'Agosto 2023',4,3,2,2),(202309,9,2023,'Setiembre 2023',5,3,3,2),
(202310,10,2023,'Octubre 2023',5,4,3,2),(202311,11,2023,'Noviembre 2023',6,4,3,2),(202312,12,2023,'Diciembre 2023',6,4,4,2),
(202401,1,2024,'Enero 2024',1,1,1,1),(202402,2,2024,'Febrero 2024',1,1,1,1),(202403,3,2024,'Marzo 2024',2,1,1,1),
(202404,4,2024,'Abril 2024',2,2,1,1),(202405,5,2024,'Mayo 2024',3,2,2,1),(202406,6,2024,'Junio 2024',3,2,2,1),
(202407,7,2024,'Julio 2024',4,3,2,2),(202408,8,2024,'Agosto 2024',4,3,2,2),(202409,9,2024,'Setiembre 2024',5,3,3,2),
(202410,10,2024,'Octubre 2024',5,4,3,2),(202411,11,2024,'Noviembre 2024',6,4,3,2),(202412,12,2024,'Diciembre 2024',6,4,4,2),
(202501,1,2025,'Enero 2025',1,1,1,1),(202502,2,2025,'Febrero 2025',1,1,1,1),(202503,3,2025,'Marzo 2025',2,1,1,1),
(202504,4,2025,'Abril 2025',2,2,1,1),(202505,5,2025,'Mayo 2025',3,2,2,1),(202506,6,2025,'Junio 2025',3,2,2,1),
(202507,7,2025,'Julio 2025',4,3,2,2),(202508,8,2025,'Agosto 2025',4,3,2,2),(202509,9,2025,'Setiembre 2025',5,3,3,2),
(202510,10,2025,'Octubre 2025',5,4,3,2),(202511,11,2025,'Noviembre 2025',6,4,3,2),(202512,12,2025,'Diciembre 2025',6,4,4,2);

-- ============================================================
-- BLOQUE 10: DIMENSIÓN TIEMPO DIARIA (solo días clave: fin de mes)
-- ============================================================
INSERT INTO DTIEMPO (PERIODODIA, DIA, MES, ANIO, PERIODOMES, DESCRIPCIONDIA, DIASEMANA, DIAANIO, SEMANAANIO, SEMANAMES, DESCRIPCIONMES, FERIADO, BIMESTRE, TRIMESTRE, CUATRIMESTRE, SEMESTRE) VALUES
(20151231,31,12,2015,201512,'Jueves 31/12/2015',4,365,53,5,'Diciembre 2015','N',6,4,4,2),
(20161231,31,12,2016,201612,'Sábado 31/12/2016',6,366,52,5,'Diciembre 2016','N',6,4,4,2),
(20171231,31,12,2017,201712,'Domingo 31/12/2017',7,365,52,5,'Diciembre 2017','N',6,4,4,2),
(20181231,31,12,2018,201812,'Lunes 31/12/2018',1,365,53,5,'Diciembre 2018','N',6,4,4,2),
(20191231,31,12,2019,201912,'Martes 31/12/2019',2,365,53,5,'Diciembre 2019','N',6,4,4,2),
(20201231,31,12,2020,202012,'Jueves 31/12/2020',4,366,53,5,'Diciembre 2020','N',6,4,4,2),
(20211231,31,12,2021,202112,'Viernes 31/12/2021',5,365,52,5,'Diciembre 2021','N',6,4,4,2),
(20221231,31,12,2022,202212,'Sábado 31/12/2022',6,365,52,5,'Diciembre 2022','N',6,4,4,2),
(20231231,31,12,2023,202312,'Domingo 31/12/2023',7,365,52,5,'Diciembre 2023','N',6,4,4,2),
(20241231,31,12,2024,202412,'Martes 31/12/2024',2,366,53,5,'Diciembre 2024','N',6,4,4,2),
(20251231,31,12,2025,202512,'Miércoles 31/12/2025',3,365,53,5,'Diciembre 2025','N',6,4,4,2);

-- ============================================================
-- BLOQUE 11: UBIGEO (principales distritos del sistema)
-- ============================================================
INSERT INTO DUBIGEO (CODDEPARTAMENTO, DESDEPARTAMENTO, CODPROVINCIA, DESPROVINCIA, CODDISTRITO, DESDISTRITO, CODZONA, DESZONA) VALUES
-- JUNIN (sede principal)
('12','Junín','1201','Huancayo','120101','Huancayo','Z01','Zona Centro'),
('12','Junín','1201','Huancayo','120104','El Tambo','Z01','Zona Centro'),
('12','Junín','1201','Huancayo','120106','Chilca','Z01','Zona Centro'),
('12','Junín','1201','Huancayo','120126','Pilcomayo','Z01','Zona Centro'),
('12','Junín','1201','Huancayo','120127','Pucará','Z02','Zona Sierra'),
('12','Junín','1203','Jauja','120301','Jauja','Z02','Zona Sierra'),
('12','Junín','1206','Satipo','120601','Satipo','Z03','Zona Selva'),
('12','Junín','1205','Junín','120501','Junín','Z02','Zona Sierra'),
('12','Junín','1207','Tarma','120701','Tarma','Z02','Zona Sierra'),
('12','Junín','1208','Yauli','120801','La Oroya','Z02','Zona Sierra'),
('12','Junín','1202','Concepción','120201','Concepción','Z02','Zona Sierra'),
('12','Junín','1204','Chanchamayo','120401','La Merced','Z03','Zona Selva'),
-- LIMA
('15','Lima','1501','Lima','150101','Lima','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150102','Ancón','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150108','Carabayllo','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150113','Independencia','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150117','Los Olivos','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150122','Miraflores','Z05','Zona Sur Lima'),
('15','Lima','1501','Lima','150125','Pueblo Libre','Z05','Zona Sur Lima'),
('15','Lima','1501','Lima','150130','San Juan de Lurigancho','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150131','San Juan de Miraflores','Z05','Zona Sur Lima'),
('15','Lima','1501','Lima','150136','San Martín de Porres','Z04','Zona Norte Lima'),
('15','Lima','1501','Lima','150140','Surquillo','Z05','Zona Sur Lima'),
('15','Lima','1501','Lima','150141','Villa El Salvador','Z05','Zona Sur Lima'),
('15','Lima','1501','Lima','150142','Villa María del Triunfo','Z05','Zona Sur Lima'),
-- AYACUCHO
('05','Ayacucho','0501','Huamanga','050101','Ayacucho','Z06','Zona Sur'),
('05','Ayacucho','0506','Huanta','050601','Huanta','Z06','Zona Sur'),
('05','Ayacucho','0510','La Mar','051001','San Miguel','Z06','Zona Sur'),
-- HUANCAVELICA
('09','Huancavelica','0901','Huancavelica','090101','Huancavelica','Z06','Zona Sur'),
('09','Huancavelica','0902','Acobamba','090201','Acobamba','Z06','Zona Sur'),
('09','Huancavelica','0907','Tayacaja','090701','Pampas','Z06','Zona Sur'),
-- HUANUCO
('10','Huánuco','1001','Huánuco','100101','Huánuco','Z07','Zona Centro Norte'),
('10','Huánuco','1003','Leoncio Prado','100301','Tingo María','Z07','Zona Centro Norte'),
('10','Huánuco','1006','Pachitea','100601','Panao','Z07','Zona Centro Norte'),
-- PASCO
('19','Pasco','1901','Pasco','190101','Chaupimarca','Z07','Zona Centro Norte'),
('19','Pasco','1902','Daniel A. Carrión','190201','Yanahuanca','Z07','Zona Centro Norte'),
('19','Pasco','1903','Oxapampa','190301','Oxapampa','Z03','Zona Selva'),
-- AREQUIPA
('04','Arequipa','0401','Arequipa','040101','Arequipa','Z08','Zona Sur'),
('04','Arequipa','0401','Arequipa','040106','Cerro Colorado','Z08','Zona Sur'),
('04','Arequipa','0401','Arequipa','040111','José L. Bustamante','Z08','Zona Sur'),
-- CUSCO
('08','Cusco','0801','Cusco','080101','Cusco','Z08','Zona Sur'),
('08','Cusco','0801','Cusco','080108','San Sebastián','Z08','Zona Sur'),
('08','Cusco','0802','Acomayo','080201','Acomayo','Z08','Zona Sur'),
-- CAJAMARCA
('06','Cajamarca','0601','Cajamarca','060101','Cajamarca','Z09','Zona Norte'),
('06','Cajamarca','0603','Cajabamba','060301','Cajabamba','Z09','Zona Norte'),
('06','Cajamarca','0606','Chota','060601','Chota','Z09','Zona Norte'),
-- LA LIBERTAD
('13','La Libertad','1301','Trujillo','130101','Trujillo','Z09','Zona Norte'),
('13','La Libertad','1301','Trujillo','130104','El Porvenir','Z09','Zona Norte'),
('13','La Libertad','1303','Ascope','130301','Chocope','Z09','Zona Norte'),
-- LAMBAYEQUE
('14','Lambayeque','1401','Chiclayo','140101','Chiclayo','Z09','Zona Norte'),
('14','Lambayeque','1401','Chiclayo','140105','José L. Ortiz','Z09','Zona Norte'),
-- PIURA
('20','Piura','2001','Piura','200101','Piura','Z09','Zona Norte'),
('20','Piura','2001','Piura','200104','Castilla','Z09','Zona Norte'),
-- ICA
('11','Ica','1101','Ica','110101','Ica','Z08','Zona Sur'),
('11','Ica','1104','Chincha','110401','Chincha Alta','Z08','Zona Sur'),
-- ANCASH
('02','Ancash','0201','Huaraz','020101','Huaraz','Z07','Zona Centro Norte'),
('02','Ancash','0206','Santa','020601','Chimbote','Z07','Zona Centro Norte'),
-- SAN MARTÍN
('22','San Martín','2201','Moyobamba','220101','Moyobamba','Z10','Zona Oriente'),
('22','San Martín','2206','San Martín','220601','Tarapoto','Z10','Zona Oriente'),
-- LORETO
('16','Loreto','1601','Maynas','160101','Iquitos','Z10','Zona Oriente'),
-- UCAYALI
('25','Ucayali','2501','Coronel Portillo','250101','Callería','Z10','Zona Oriente'),
-- MADRE DE DIOS
('17','Madre de Dios','1701','Tambopata','170101','Tambopata','Z10','Zona Oriente'),
-- PUNO
('21','Puno','2101','Puno','210101','Puno','Z08','Zona Sur'),
('21','Puno','2106','San Román','210601','Juliaca','Z08','Zona Sur'),
-- TACNA
('23','Tacna','2301','Tacna','230101','Tacna','Z08','Zona Sur'),
-- MOQUEGUA
('18','Moquegua','1803','Ilo','180301','Ilo','Z08','Zona Sur'),
-- AMAZONAS
('01','Amazonas','0101','Chachapoyas','010101','Chachapoyas','Z09','Zona Norte'),
('01','Amazonas','0107','Utcubamba','010701','Bagua Grande','Z09','Zona Norte'),
-- APURIMAC
('03','Apurímac','0301','Abancay','030101','Abancay','Z08','Zona Sur'),
('03','Apurímac','0302','Andahuaylas','030201','Andahuaylas','Z08','Zona Sur'),
-- TUMBES
('24','Tumbes','2401','Tumbes','240101','Tumbes','Z09','Zona Norte');

-- ============================================================
-- BLOQUE 12: DAGENCIA — 250 oficinas Banco Andino (ficticias)
-- Distribución real: Lima=80, Junín=41, Cusco=10, Huánuco=10...
-- Nombres ficticios inspirados en el sistema real
-- ============================================================
INSERT INTO DAGENCIA (CODAGENCIA, DESAGENCIA, CODZONACOMERCIAL, DESZONACOMERCIAL, PKUBIGEO, LONGITUD, LATITUD, CODTIPOAGENCIA, DESTIPOAGENCIA, FECHAINICIOVIG, FLAGACTIVO) VALUES
-- JUNÍN (41 agencias — sede principal)
('0001','Agencia Principal Huancayo','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2050,-12.0640,'OP','Oficina Principal','2000-01-01','1'),
('0002','Agencia El Tambo','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120104'),-75.1890,-12.0490,'AG','Agencia','2003-05-15','1'),
('0003','Agencia Chilca','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120106'),-75.2180,-12.0780,'AG','Agencia','2005-03-01','1'),
('0004','Agencia Pilcomayo','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120126'),-75.1960,-12.0550,'AG','Agencia','2008-06-10','1'),
('0005','Agencia Real Huancayo','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2040,-12.0620,'AG','Agencia','2004-09-20','1'),
('0006','Agencia Breña Huancayo','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2100,-12.0700,'AG','Agencia','2010-02-14','1'),
('0007','Agencia San Carlos Huancayo','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2060,-12.0580,'AG','Agencia','2011-08-01','1'),
('0008','Agencia Jauja','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120301'),-75.5010,-11.7760,'AG','Agencia','2006-04-12','1'),
('0009','Agencia Satipo','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120601'),-74.6390,-11.2580,'AG','Agencia','2009-11-03','1'),
('0010','Agencia Tarma','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120701'),-75.6880,-11.4180,'AG','Agencia','2007-07-22','1'),
('0011','Agencia La Oroya','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120801'),-75.9000,-11.5330,'AG','Agencia','2008-03-10','1'),
('0012','Agencia Concepción','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120201'),-75.3120,-11.9130,'AG','Agencia','2010-09-15','1'),
('0013','Agencia La Merced','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120401'),-75.3230,-11.0560,'AG','Agencia','2011-01-20','1'),
('0014','Agencia Huancayo 2','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2070,-12.0660,'AG','Agencia','2012-05-07','1'),
('0015','Agencia Huancayo 3','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2030,-12.0600,'AG','Agencia','2013-02-18','1'),
('0016','Agencia Huancayo 4','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2090,-12.0580,'AG','Agencia','2014-08-25','1'),
('0017','Agencia El Tambo 2','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120104'),-75.1910,-12.0510,'AG','Agencia','2015-03-10','1'),
('0018','Agencia Huancayo Norte','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2050,-12.0550,'AG','Agencia','2016-06-15','1'),
('0019','Agencia Huancayo Sur','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2060,-12.0710,'AG','Agencia','2016-09-20','1'),
('0020','Agencia Huancayo Este','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.1980,-12.0640,'AG','Agencia','2017-04-05','1'),
('0021','Agencia Huancayo Oeste','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2130,-12.0630,'AG','Agencia','2017-10-12','1'),
('0022','Agencia El Tambo 3','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120104'),-75.1870,-12.0480,'AG','Agencia','2018-02-28','1'),
('0023','Agencia Chilca 2','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120106'),-75.2200,-12.0800,'AG','Agencia','2018-07-15','1'),
('0024','Agencia Jauja 2','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120301'),-75.5030,-11.7780,'AG','Agencia','2019-01-10','1'),
('0025','Agencia Chanchamayo','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120401'),-75.3200,-11.0580,'AG','Agencia','2019-05-20','1'),
('0026','Agencia Huancayo Centro','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2045,-12.0625,'AG','Agencia','2020-01-15','1'),
('0027','Agencia Huancayo Mall','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2035,-12.0615,'AG','Agencia','2020-08-10','1'),
('0028','Agencia Satipo 2','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120601'),-74.6410,-11.2600,'AG','Agencia','2021-03-22','1'),
('0029','Agencia Pucará','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120127'),-75.1500,-11.9100,'AG','Agencia','2021-09-08','1'),
('0030','Agencia La Merced 2','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120401'),-75.3250,-11.0570,'AG','Agencia','2022-02-14','1'),
('0031','Agencia El Tambo Express','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120104'),-75.1900,-12.0500,'EX','Express','2022-06-01','1'),
('0032','Agencia Huancayo Express','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2055,-12.0635,'EX','Express','2022-11-15','1'),
('0033','Agencia Concepción 2','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120201'),-75.3140,-11.9150,'AG','Agencia','2023-03-20','1'),
('0034','Agencia Tarma 2','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120701'),-75.6900,-11.4200,'AG','Agencia','2023-07-10','1'),
('0035','Agencia Jauja 3','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120301'),-75.5050,-11.7790,'AG','Agencia','2023-11-05','1'),
('0036','Agencia Huancayo Digital','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2048,-12.0628,'DG','Digital','2024-01-20','1'),
('0037','Agencia El Tambo 4','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120104'),-75.1880,-12.0490,'AG','Agencia','2024-04-15','1'),
('0038','Agencia Oxapampa','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190301'),-75.4040,-10.5790,'AG','Agencia','2024-08-01','1'),
('0039','Agencia Pampas','Z02','Zona Sierra',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090701'),-74.8720,-12.3960,'AG','Agencia','2024-09-10','1'),
('0040','Agencia Huancayo 5','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2042,-12.0618,'AG','Agencia','2025-02-03','1'),
('0041','Agencia Huancayo 6','Z01','Zona Centro',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='120101'),-75.2038,-12.0622,'AG','Agencia','2025-05-12','1'),
-- LIMA (80 agencias)
('0042','Agencia San Martín de Porres','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150136'),-77.0650,-12.0250,'AG','Agencia','2006-03-15','1'),
('0043','Agencia Los Olivos','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150117'),-77.0690,-11.9930,'AG','Agencia','2007-08-20','1'),
('0044','Agencia Carabayllo','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150108'),-77.0360,-11.9160,'AG','Agencia','2009-02-10','1'),
('0045','Agencia San Juan de Lurigancho','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150130'),-77.0040,-12.0100,'AG','Agencia','2009-07-05','1'),
('0046','Agencia Villa El Salvador','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150141'),-76.9420,-12.2100,'AG','Agencia','2010-04-18','1'),
('0047','Agencia Villa María del Triunfo','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150142'),-76.9370,-12.1620,'AG','Agencia','2010-10-25','1'),
('0048','Agencia San Juan de Miraflores','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150131'),-76.9620,-12.1540,'AG','Agencia','2011-05-30','1'),
('0049','Agencia Independencia','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150113'),-77.0550,-11.9990,'AG','Agencia','2011-11-14','1'),
('0050','Agencia Miraflores Lima','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150122'),-77.0280,-12.1190,'AG','Agencia','2012-06-08','1'),
('0051','Agencia Lima Centro','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0282,-12.0464,'AG','Agencia','2012-09-20','1'),
('0052','Agencia Lima 2','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0300,-12.0480,'AG','Agencia','2013-03-12','1'),
('0053','Agencia Lima 3','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0260,-12.0450,'AG','Agencia','2013-07-25','1'),
('0054','Agencia Lima 4','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0240,-12.0440,'AG','Agencia','2014-01-15','1'),
('0055','Agencia Lima 5','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0320,-12.0500,'AG','Agencia','2014-05-20','1'),
('0056','Agencia Lima 6','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0340,-12.0520,'AG','Agencia','2014-09-10','1'),
('0057','Agencia Lima 7','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0220,-12.0430,'AG','Agencia','2015-02-03','1'),
('0058','Agencia Lima 8','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0200,-12.0420,'AG','Agencia','2015-06-18','1'),
('0059','Agencia Lima 9','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0360,-12.0540,'AG','Agencia','2015-10-05','1'),
('0060','Agencia Lima 10','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0180,-12.0410,'AG','Agencia','2016-03-22','1'),
('0061','Agencia Surquillo','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150140'),-77.0210,-12.1110,'AG','Agencia','2016-08-14','1'),
('0062','Agencia Pueblo Libre','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150125'),-77.0620,-12.0780,'AG','Agencia','2017-01-30','1'),
('0063','Agencia SJL 2','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150130'),-77.0060,-12.0120,'AG','Agencia','2017-06-12','1'),
('0064','Agencia SMP 2','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150136'),-77.0670,-12.0270,'AG','Agencia','2017-11-08','1'),
('0065','Agencia Los Olivos 2','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150117'),-77.0710,-11.9950,'AG','Agencia','2018-04-20','1'),
('0066','Agencia Villa ES 2','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150141'),-76.9440,-12.2120,'AG','Agencia','2018-09-15','1'),
('0067','Agencia Lima 11','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0160,-12.0400,'AG','Agencia','2019-02-28','1'),
('0068','Agencia Lima 12','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0140,-12.0390,'AG','Agencia','2019-07-10','1'),
('0069','Agencia Lima 13','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0120,-12.0380,'AG','Agencia','2019-11-05','1'),
('0070','Agencia Lima 14','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0380,-12.0560,'AG','Agencia','2020-03-10','1'),
('0071','Agencia Lima 15','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0400,-12.0580,'AG','Agencia','2020-07-15','1'),
('0072','Agencia Lima 16','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0420,-12.0600,'AG','Agencia','2020-11-20','1'),
('0073','Agencia Lima 17','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0440,-12.0620,'AG','Agencia','2021-04-05','1'),
('0074','Agencia Lima 18','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0460,-12.0640,'AG','Agencia','2021-08-18','1'),
('0075','Agencia Lima 19','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0480,-12.0660,'AG','Agencia','2022-01-25','1'),
('0076','Agencia Lima 20','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0500,-12.0680,'AG','Agencia','2022-05-30','1'),
('0077','Agencia Lima 21','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0520,-12.0700,'AG','Agencia','2022-10-14','1'),
('0078','Agencia Lima 22','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0540,-12.0720,'AG','Agencia','2023-02-20','1'),
('0079','Agencia Lima 23','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0560,-12.0740,'AG','Agencia','2023-06-08','1'),
('0080','Agencia Lima 24','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0580,-12.0760,'AG','Agencia','2023-09-25','1'),
('0081','Agencia Lima 25','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0600,-12.0780,'AG','Agencia','2024-01-10','1'),
('0082','Agencia Lima 26','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0620,-12.0800,'AG','Agencia','2024-03-15','1'),
('0083','Agencia Lima 27','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0640,-12.0820,'AG','Agencia','2024-05-20','1'),
('0084','Agencia Lima 28','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0660,-12.0840,'AG','Agencia','2024-07-08','1'),
('0085','Agencia Lima 29','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0680,-12.0860,'AG','Agencia','2024-09-15','1'),
('0086','Agencia Lima 30','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0700,-12.0880,'AG','Agencia','2024-11-01','1'),
('0087','Agencia Lima 31','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0720,-12.0900,'AG','Agencia','2025-01-15','1'),
('0088','Agencia Lima 32','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0740,-12.0920,'AG','Agencia','2025-03-10','1'),
('0089','Agencia Lima 33','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0760,-12.0940,'AG','Agencia','2025-05-20','1'),
('0090','Agencia Lima 34','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0780,-12.0960,'AG','Agencia','2025-07-01','1'),
-- AYACUCHO (7)
('0091','Agencia Ayacucho','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='050101'),-74.2230,-13.1590,'AG','Agencia','2010-06-15','1'),
('0092','Agencia Huanta','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='050601'),-74.2470,-12.9330,'AG','Agencia','2012-09-10','1'),
('0093','Agencia San Miguel','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='051001'),-73.9940,-13.0000,'AG','Agencia','2015-04-20','1'),
('0094','Agencia Ayacucho 2','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='050101'),-74.2250,-13.1610,'AG','Agencia','2017-08-15','1'),
('0095','Agencia Ayacucho 3','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='050101'),-74.2270,-13.1630,'AG','Agencia','2019-11-05','1'),
('0096','Agencia Ayacucho 4','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='050101'),-74.2290,-13.1650,'AG','Agencia','2022-03-20','1'),
('0097','Agencia Ayacucho 5','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='050101'),-74.2310,-13.1670,'AG','Agencia','2024-06-10','1'),
-- HUANCAVELICA (7)
('0098','Agencia Huancavelica','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090101'),-74.9750,-12.7870,'AG','Agencia','2011-03-08','1'),
('0099','Agencia Acobamba','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090201'),-74.5690,-12.8470,'AG','Agencia','2013-07-22','1'),
('0100','Agencia Pampas','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090701'),-74.8720,-12.3960,'AG','Agencia','2015-11-15','1'),
('0101','Agencia Huancavelica 2','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090101'),-74.9770,-12.7890,'AG','Agencia','2018-04-10','1'),
('0102','Agencia Huancavelica 3','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090101'),-74.9790,-12.7910,'AG','Agencia','2020-09-05','1'),
('0103','Agencia Huancavelica 4','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090101'),-74.9810,-12.7930,'AG','Agencia','2022-12-12','1'),
('0104','Agencia Huancavelica 5','Z06','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='090101'),-74.9830,-12.7950,'AG','Agencia','2024-07-18','1'),
-- HUÁNUCO (10)
('0105','Agencia Huánuco','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2280,-9.9306,'AG','Agencia','2010-01-20','1'),
('0106','Agencia Tingo María','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100301'),-75.9990,-9.2950,'AG','Agencia','2011-06-15','1'),
('0107','Agencia Panao','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100601'),-75.9150,-9.9070,'AG','Agencia','2013-10-08','1'),
('0108','Agencia Huánuco 2','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2300,-9.9326,'AG','Agencia','2015-05-20','1'),
('0109','Agencia Huánuco 3','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2320,-9.9346,'AG','Agencia','2017-09-14','1'),
('0110','Agencia Huánuco 4','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2340,-9.9366,'AG','Agencia','2019-03-25','1'),
('0111','Agencia Huánuco 5','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2360,-9.9386,'AG','Agencia','2020-11-10','1'),
('0112','Agencia Tingo María 2','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100301'),-76.0010,-9.2970,'AG','Agencia','2022-04-05','1'),
('0113','Agencia Huánuco 6','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2380,-9.9406,'AG','Agencia','2023-08-20','1'),
('0114','Agencia Huánuco 7','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='100101'),-76.2400,-9.9426,'AG','Agencia','2025-02-15','1'),
-- CUSCO (10)
('0115','Agencia Cusco','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9782,-13.5170,'AG','Agencia','2012-04-10','1'),
('0116','Agencia San Sebastián Cusco','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080108'),-71.9450,-13.5350,'AG','Agencia','2014-08-22','1'),
('0117','Agencia Cusco 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9800,-13.5190,'AG','Agencia','2016-11-15','1'),
('0118','Agencia Cusco 3','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9820,-13.5210,'AG','Agencia','2018-05-08','1'),
('0119','Agencia Cusco 4','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9840,-13.5230,'AG','Agencia','2019-10-20','1'),
('0120','Agencia Cusco 5','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9860,-13.5250,'AG','Agencia','2021-03-12','1'),
('0121','Agencia Cusco 6','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9880,-13.5270,'AG','Agencia','2022-07-28','1'),
('0122','Agencia Cusco 7','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9900,-13.5290,'AG','Agencia','2023-12-05','1'),
('0123','Agencia Cusco 8','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080101'),-71.9920,-13.5310,'AG','Agencia','2024-04-18','1'),
('0124','Agencia Acomayo','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='080201'),-71.6870,-13.9220,'AG','Agencia','2025-01-10','1'),
-- CAJAMARCA (9)
('0125','Agencia Cajamarca','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060101'),-78.5050,-7.1630,'AG','Agencia','2013-02-18','1'),
('0126','Agencia Cajabamba','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060301'),-78.0420,-7.6230,'AG','Agencia','2015-06-10','1'),
('0127','Agencia Chota','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060601'),-78.6480,-6.5590,'AG','Agencia','2017-09-25','1'),
('0128','Agencia Cajamarca 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060101'),-78.5070,-7.1650,'AG','Agencia','2019-04-15','1'),
('0129','Agencia Cajamarca 3','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060101'),-78.5090,-7.1670,'AG','Agencia','2020-10-08','1'),
('0130','Agencia Cajamarca 4','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060101'),-78.5110,-7.1690,'AG','Agencia','2022-02-20','1'),
('0131','Agencia Cajamarca 5','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060101'),-78.5130,-7.1710,'AG','Agencia','2023-06-14','1'),
('0132','Agencia Cajabamba 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060301'),-78.0440,-7.6250,'AG','Agencia','2024-03-05','1'),
('0133','Agencia Cajamarca 6','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='060101'),-78.5150,-7.1730,'AG','Agencia','2025-04-20','1'),
-- LA LIBERTAD (8)
('0134','Agencia Trujillo','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130101'),-79.0300,-8.1120,'AG','Agencia','2014-05-22','1'),
('0135','Agencia El Porvenir','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130104'),-79.0050,-8.0830,'AG','Agencia','2016-09-18','1'),
('0136','Agencia Trujillo 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130101'),-79.0320,-8.1140,'AG','Agencia','2018-12-10','1'),
('0137','Agencia Trujillo 3','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130101'),-79.0340,-8.1160,'AG','Agencia','2020-06-25','1'),
('0138','Agencia Trujillo 4','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130101'),-79.0360,-8.1180,'AG','Agencia','2021-11-15','1'),
('0139','Agencia Trujillo 5','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130101'),-79.0380,-8.1200,'AG','Agencia','2023-04-08','1'),
('0140','Agencia Chocope','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130301'),-79.2100,-7.7790,'AG','Agencia','2024-02-12','1'),
('0141','Agencia Trujillo 6','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='130101'),-79.0400,-8.1220,'AG','Agencia','2025-06-01','1'),
-- LAMBAYEQUE (5)
('0142','Agencia Chiclayo','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='140101'),-79.8370,-6.7730,'AG','Agencia','2015-08-15','1'),
('0143','Agencia J.L. Ortiz','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='140105'),-79.8200,-6.7700,'AG','Agencia','2017-12-10','1'),
('0144','Agencia Chiclayo 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='140101'),-79.8390,-6.7750,'AG','Agencia','2020-04-22','1'),
('0145','Agencia Chiclayo 3','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='140101'),-79.8410,-6.7770,'AG','Agencia','2022-09-18','1'),
('0146','Agencia Chiclayo 4','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='140101'),-79.8430,-6.7790,'AG','Agencia','2024-05-30','1'),
-- PASCO (8)
('0147','Agencia Chaupimarca','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190101'),-76.2510,-10.6920,'AG','Agencia','2013-11-05','1'),
('0148','Agencia Yanahuanca','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190201'),-76.5160,-10.4700,'AG','Agencia','2016-03-18','1'),
('0149','Agencia Oxapampa 2','Z03','Zona Selva',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190301'),-75.4060,-10.5810,'AG','Agencia','2018-08-22','1'),
('0150','Agencia Chaupimarca 2','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190101'),-76.2530,-10.6940,'AG','Agencia','2020-02-14','1'),
('0151','Agencia Chaupimarca 3','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190101'),-76.2550,-10.6960,'AG','Agencia','2021-07-30','1'),
('0152','Agencia Chaupimarca 4','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190101'),-76.2570,-10.6980,'AG','Agencia','2023-01-15','1'),
('0153','Agencia Chaupimarca 5','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190101'),-76.2590,-10.7000,'AG','Agencia','2024-04-08','1'),
('0154','Agencia Chaupimarca 6','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='190101'),-76.2610,-10.7020,'AG','Agencia','2025-08-01','1'),
-- PIURA (8)
('0155','Agencia Piura','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6280,-5.1945,'AG','Agencia','2016-06-20','1'),
('0156','Agencia Castilla','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200104'),-80.6350,-5.1780,'AG','Agencia','2018-10-15','1'),
('0157','Agencia Piura 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6300,-5.1965,'AG','Agencia','2020-05-12','1'),
('0158','Agencia Piura 3','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6320,-5.1985,'AG','Agencia','2021-12-08','1'),
('0159','Agencia Piura 4','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6340,-5.2005,'AG','Agencia','2023-03-25','1'),
('0160','Agencia Piura 5','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6360,-5.2025,'AG','Agencia','2024-01-18','1'),
('0161','Agencia Piura 6','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6380,-5.2045,'AG','Agencia','2024-08-10','1'),
('0162','Agencia Piura 7','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='200101'),-80.6400,-5.2065,'AG','Agencia','2025-06-15','1'),
-- ICA (7)
('0163','Agencia Ica','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110101'),-75.7290,-14.0680,'AG','Agencia','2015-04-10','1'),
('0164','Agencia Chincha Alta','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110401'),-76.1310,-13.4100,'AG','Agencia','2017-08-25','1'),
('0165','Agencia Ica 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110101'),-75.7310,-14.0700,'AG','Agencia','2019-12-15','1'),
('0166','Agencia Ica 3','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110101'),-75.7330,-14.0720,'AG','Agencia','2021-06-08','1'),
('0167','Agencia Chincha 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110401'),-76.1330,-13.4120,'AG','Agencia','2023-01-20','1'),
('0168','Agencia Ica 4','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110101'),-75.7350,-14.0740,'AG','Agencia','2024-04-05','1'),
('0169','Agencia Ica 5','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='110101'),-75.7370,-14.0760,'AG','Agencia','2025-03-12','1'),
-- ANCASH (6)
('0170','Agencia Huaraz','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='020101'),-77.5291,-9.5280,'AG','Agencia','2014-09-18','1'),
('0171','Agencia Chimbote','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='020601'),-78.5935,-9.0745,'AG','Agencia','2016-02-22','1'),
('0172','Agencia Huaraz 2','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='020101'),-77.5311,-9.5300,'AG','Agencia','2018-07-15','1'),
('0173','Agencia Chimbote 2','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='020601'),-78.5955,-9.0765,'AG','Agencia','2021-01-10','1'),
('0174','Agencia Huaraz 3','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='020101'),-77.5331,-9.5320,'AG','Agencia','2023-05-25','1'),
('0175','Agencia Chimbote 3','Z07','Zona Centro Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='020601'),-78.5975,-9.0785,'AG','Agencia','2025-01-08','1'),
-- SAN MARTÍN (6)
('0176','Agencia Tarapoto','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='220601'),-76.3570,-6.4850,'AG','Agencia','2016-11-20','1'),
('0177','Agencia Moyobamba','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='220101'),-76.9720,-6.0350,'AG','Agencia','2018-06-15','1'),
('0178','Agencia Tarapoto 2','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='220601'),-76.3590,-6.4870,'AG','Agencia','2020-09-08','1'),
('0179','Agencia Tarapoto 3','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='220601'),-76.3610,-6.4890,'AG','Agencia','2022-03-18','1'),
('0180','Agencia Moyobamba 2','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='220101'),-76.9740,-6.0370,'AG','Agencia','2023-10-05','1'),
('0181','Agencia Tarapoto 4','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='220601'),-76.3630,-6.4910,'AG','Agencia','2025-04-12','1'),
-- LORETO (5)
('0182','Agencia Iquitos','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='160101'),-73.2533,-3.7491,'AG','Agencia','2018-03-22','1'),
('0183','Agencia Iquitos 2','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='160101'),-73.2553,-3.7511,'AG','Agencia','2020-07-15','1'),
('0184','Agencia Iquitos 3','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='160101'),-73.2573,-3.7531,'AG','Agencia','2022-01-20','1'),
('0185','Agencia Iquitos 4','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='160101'),-73.2593,-3.7551,'AG','Agencia','2023-08-10','1'),
('0186','Agencia Iquitos 5','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='160101'),-73.2613,-3.7571,'AG','Agencia','2025-02-25','1'),
-- AREQUIPA (5)
('0187','Agencia Arequipa','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='040101'),-71.5369,-16.4090,'AG','Agencia','2017-05-10','1'),
('0188','Agencia Cerro Colorado','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='040106'),-71.5520,-16.3830,'AG','Agencia','2019-09-22','1'),
('0189','Agencia J.L. Bustamante Arequipa','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='040111'),-71.5150,-16.4280,'AG','Agencia','2021-04-15','1'),
('0190','Agencia Arequipa 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='040101'),-71.5389,-16.4110,'AG','Agencia','2023-02-08','1'),
('0191','Agencia Arequipa 3','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='040101'),-71.5409,-16.4130,'AG','Agencia','2025-07-15','1'),
-- APURÍMAC (4)
('0192','Agencia Abancay','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='030101'),-72.8810,-13.6340,'AG','Agencia','2018-01-15','1'),
('0193','Agencia Andahuaylas','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='030201'),-73.3850,-13.6560,'AG','Agencia','2020-06-20','1'),
('0194','Agencia Abancay 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='030101'),-72.8830,-13.6360,'AG','Agencia','2022-11-08','1'),
('0195','Agencia Andahuaylas 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='030201'),-73.3870,-13.6580,'AG','Agencia','2025-03-20','1'),
-- PUNO (5)
('0196','Agencia Puno','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='210101'),-70.0136,-15.8402,'AG','Agencia','2018-07-10','1'),
('0197','Agencia Juliaca','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='210601'),-70.1323,-15.4910,'AG','Agencia','2020-01-25','1'),
('0198','Agencia Puno 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='210101'),-70.0156,-15.8422,'AG','Agencia','2022-05-18','1'),
('0199','Agencia Juliaca 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='210601'),-70.1343,-15.4930,'AG','Agencia','2023-09-12','1'),
('0200','Agencia Puno 3','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='210101'),-70.0176,-15.8442,'AG','Agencia','2025-05-08','1'),
-- UCAYALI (4)
('0201','Agencia Pucallpa','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='250101'),-74.5539,-8.3791,'AG','Agencia','2019-04-15','1'),
('0202','Agencia Pucallpa 2','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='250101'),-74.5559,-8.3811,'AG','Agencia','2021-08-20','1'),
('0203','Agencia Pucallpa 3','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='250101'),-74.5579,-8.3831,'AG','Agencia','2023-12-05','1'),
('0204','Agencia Pucallpa 4','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='250101'),-74.5599,-8.3851,'AG','Agencia','2025-06-18','1'),
-- TACNA (3)
('0205','Agencia Tacna','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='230101'),-70.0152,-18.0139,'AG','Agencia','2019-10-08','1'),
('0206','Agencia Tacna 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='230101'),-70.0172,-18.0159,'AG','Agencia','2022-03-15','1'),
('0207','Agencia Tacna 3','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='230101'),-70.0192,-18.0179,'AG','Agencia','2024-09-20','1'),
-- AMAZONAS (3)
('0208','Agencia Chachapoyas','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='010101'),-77.8700,-6.2280,'AG','Agencia','2019-07-22','1'),
('0209','Agencia Bagua Grande','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='010701'),-78.4480,-5.7540,'AG','Agencia','2021-11-10','1'),
('0210','Agencia Chachapoyas 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='010101'),-77.8720,-6.2300,'AG','Agencia','2024-02-05','1'),
-- MADRE DE DIOS (2)
('0211','Agencia Puerto Maldonado','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='170101'),-69.1851,-12.5933,'AG','Agencia','2020-08-18','1'),
('0212','Agencia Puerto Maldonado 2','Z10','Zona Oriente',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='170101'),-69.1871,-12.5953,'AG','Agencia','2023-04-12','1'),
-- MOQUEGUA (2)
('0213','Agencia Ilo','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='180301'),-71.3420,-17.6390,'AG','Agencia','2020-11-25','1'),
('0214','Agencia Ilo 2','Z08','Zona Sur',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='180301'),-71.3440,-17.6410,'AG','Agencia','2023-07-08','1'),
-- TUMBES (2)
('0215','Agencia Tumbes','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='240101'),-80.4514,-3.5669,'AG','Agencia','2021-05-15','1'),
('0216','Agencia Tumbes 2','Z09','Zona Norte',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='240101'),-80.4534,-3.5689,'AG','Agencia','2024-01-22','1'),
-- CALLAO (3)
('0217','Agencia Callao','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1167,-12.0566,'AG','Agencia','2015-09-10','1'),
('0218','Agencia Callao 2','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1187,-12.0586,'AG','Agencia','2018-04-25','1'),
('0219','Agencia Callao 3','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1207,-12.0606,'AG','Agencia','2021-10-12','1'),
-- LIMA (agencias 220-250 adicionales para completar las 80)
('0220','Agencia Lima 35','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0800,-12.1000,'AG','Agencia','2016-01-15','1'),
('0221','Agencia Lima 36','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0820,-12.1020,'AG','Agencia','2016-07-08','1'),
('0222','Agencia Lima 37','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0840,-12.1040,'AG','Agencia','2017-03-20','1'),
('0223','Agencia Lima 38','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0860,-12.1060,'AG','Agencia','2017-08-14','1'),
('0224','Agencia Lima 39','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0880,-12.1080,'AG','Agencia','2018-02-28','1'),
('0225','Agencia Lima 40','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0900,-12.1100,'AG','Agencia','2018-06-10','1'),
('0226','Agencia Lima 41','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0920,-12.1120,'AG','Agencia','2019-01-22','1'),
('0227','Agencia Lima 42','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0940,-12.1140,'AG','Agencia','2019-08-15','1'),
('0228','Agencia Lima 43','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150131'),-76.9640,-12.1560,'AG','Agencia','2020-04-05','1'),
('0229','Agencia Lima 44','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150141'),-76.9460,-12.2140,'AG','Agencia','2020-09-18','1'),
('0230','Agencia Lima 45','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150142'),-76.9390,-12.1640,'AG','Agencia','2021-02-25','1'),
('0231','Agencia Lima 46','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150131'),-76.9660,-12.1580,'AG','Agencia','2021-06-10','1'),
('0232','Agencia Lima 47','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150136'),-77.0690,-12.0290,'AG','Agencia','2021-11-22','1'),
('0233','Agencia Lima 48','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150117'),-77.0730,-11.9970,'AG','Agencia','2022-04-08','1'),
('0234','Agencia Lima 49','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150130'),-77.0080,-12.0140,'AG','Agencia','2022-08-20','1'),
('0235','Agencia Lima 50','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150108'),-77.0380,-11.9180,'AG','Agencia','2022-12-15','1'),
('0236','Agencia Lima 51','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150113'),-77.0570,-12.0010,'AG','Agencia','2023-03-28','1'),
('0237','Agencia Lima 52','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0960,-12.1160,'AG','Agencia','2023-07-12','1'),
('0238','Agencia Lima 53','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150122'),-77.0300,-12.1210,'AG','Agencia','2023-10-05','1'),
('0239','Agencia Lima 54','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150125'),-77.0640,-12.0800,'AG','Agencia','2024-02-18','1'),
('0240','Agencia Lima 55','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.0980,-12.1180,'AG','Agencia','2024-04-25','1'),
('0241','Agencia Lima 56','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150136'),-77.0710,-12.0310,'AG','Agencia','2024-06-10','1'),
('0242','Agencia Lima 57','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150117'),-77.0750,-11.9990,'AG','Agencia','2024-08-15','1'),
('0243','Agencia Lima 58','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150130'),-77.0100,-12.0160,'AG','Agencia','2024-10-20','1'),
('0244','Agencia Lima 59','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150141'),-76.9480,-12.2160,'AG','Agencia','2024-12-05','1'),
('0245','Agencia Lima 60','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1000,-12.1200,'AG','Agencia','2025-01-22','1'),
('0246','Agencia Lima 61','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1020,-12.1220,'AG','Agencia','2025-03-08','1'),
('0247','Agencia Lima 62','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150136'),-77.0730,-12.0330,'AG','Agencia','2025-04-22','1'),
('0248','Agencia Lima 63','Z05','Zona Sur Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150122'),-77.0320,-12.1230,'AG','Agencia','2025-06-05','1'),
('0249','Agencia Lima 64','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1040,-12.1240,'AG','Agencia','2025-08-18','1'),
('0250','Agencia Lima 65','Z04','Zona Norte Lima',(SELECT PKUBIGEO FROM DUBIGEO WHERE CODDISTRITO='150101'),-77.1060,-12.1260,'AG','Agencia','2025-10-01','1');

-- ============================================================
-- BLOQUE 13: JEFES REGIONALES (ficticios — personajes culturales)
-- ============================================================
INSERT INTO DJEFEREGIONAL (CODJEFEREGIONAL, NOMJEFEREGIONAL) VALUES
('JR0001','Mariátegui Flores, José Carlos'),
('JR0002','Palma Soriano, Ricardo Alberto'),
('JR0003','Vallejo Mendoza, César Abraham'),
('JR0004','Arguedas Torres, José María'),
('JR0005','Vargas Llosa, Mario Ernesto'),
('JR0006','Hidalgo Ramírez, Miguel Gregorio'),
('JR0007','Bolívar Palacios, Simón Ignacio'),
('JR0008','San Martín Herrera, José Francisco');

-- ============================================================
-- BLOQUE 14: ADMINISTRADORES DE AGENCIA (ficticios — personajes culturales)
-- ============================================================
INSERT INTO DADMINISTRADOR (CODADMINISTRADOR, NOMADMINISTRADOR) VALUES
('AD0001','Shakespeare Torres, William Eduardo'),
('AD0002','Cervantes Paz, Miguel Ángel'),
('AD0003','Goethe Ramírez, Johann Wolfgang'),
('AD0004','Dostoievski Quispe, Fiódor Miguel'),
('AD0005','Tolstoi Vargas, León Nikolái'),
('AD0006','Kafka López, Franz Josef'),
('AD0007','Borges Mendoza, Jorge Luis'),
('AD0008','García Márquez, Gabriel José'),
('AD0009','Neruda Castillo, Pablo Ricardo'),
('AD0010','Lorca Huanca, Federico García'),
('AD0011','Mistral Flores, Gabriela Lucía'),
('AD0012','Paz Morales, Octavio Irineo'),
('AD0013','Cortázar Ríos, Julio Florencio'),
('AD0014','Rulfo Díaz, Juan Nepomuceno'),
('AD0015','Asturias Paredes, Miguel Ángel'),
('AD0016','Amado Herrera, Jorge Leal'),
('AD0017','Carpentier Silva, Alejo Felipe'),
('AD0018','Fuentes Salazar, Carlos Manuel'),
('AD0019','Onetti Vega, Juan Carlos'),
('AD0020','Vargas Torres, Mario González'),
('AD0021','Sabato Quispe, Ernesto Roberto'),
('AD0022','Puig Mamani, Manuel'),
('AD0023','Benedetti Chávez, Mario Orlando'),
('AD0024','Sábato León, Ernesto'),
('AD0025','Allende Paredes, Isabel Sofía'),
('AD0026','Skármeta Flores, Antonio Óscar'),
('AD0027','Bolaño Ríos, Roberto Javier'),
('AD0028','Dario Suárez, Rubén Félix'),
('AD0029','Martí Gutiérrez, José Julián'),
('AD0030','Bello Torres, Andrés');

-- ============================================================
-- BLOQUE 15: ASESORES DE NEGOCIOS (ficticios — músicos, filósofos, pintores)
-- ============================================================
INSERT INTO DASESOR (CODASESOR, NOMASESOR) VALUES
-- Músicos
('AS0001','Beethoven Torres, Ludwig van'),('AS0002','Mozart Quispe, Wolfgang Amadeus'),
('AS0003','Bach Ramos, Johann Sebastian'),('AS0004','Chopin Flores, Frédéric François'),
('AS0005','Vivaldi Mendoza, Antonio Lucio'),('AS0006','Handel López, Georg Friedrich'),
('AS0007','Schubert Vargas, Franz Peter'),('AS0008','Brahms Huanca, Johannes Karl'),
('AS0009','Tchaikovsky Ríos, Piotr Ilich'),('AS0010','Debussy Mamani, Claude Achille'),
('AS0011','Piazzolla Chávez, Astor Pantaleón'),('AS0012','Gardel Salas, Carlos Romualdo'),
('AS0013','Coltrane Paredes, John William'),('AS0014','Davis Torres, Miles Dewey'),
('AS0015','Armstrong Quispe, Louis Daniel'),
-- Pintores y artistas
('AS0016','Kahlo Flores, Frida Carmen'),('AS0017','Rivera Mendoza, Diego María'),
('AS0018','Van Gogh López, Vincent Willem'),('AS0019','Picasso Torres, Pablo Ruiz'),
('AS0020','Dalí Vargas, Salvador Domingo'),('AS0021','Renoir Ríos, Pierre-Auguste'),
('AS0022','Monet Huanca, Claude Óscar'),('AS0023','Rembrandt Mamani, Harmenszoon'),
('AS0024','Da Vinci Chávez, Leonardo'),('AS0025','Michelangelo Paredes, Buonarroti'),
('AS0026','Rafael Salas, Sanzio Urbino'),('AS0027','Goya Quispe, Francisco José'),
('AS0028','Velázquez Torres, Diego Rodríguez'),('AS0029','El Greco Flores, Doménikos'),
('AS0030','Botticelli López, Sandro Alessandro'),
-- Filósofos
('AS0031','Sócrates Mendoza, Alopeques'),('AS0032','Platón Torres, Aristocles'),
('AS0033','Aristóteles Vargas, Estagira'),('AS0034','Kant Ríos, Immanuel'),
('AS0035','Hegel Huanca, Georg Wilhelm'),('AS0036','Nietzsche Mamani, Friedrich Wilhelm'),
('AS0037','Marx Chávez, Karl Heinrich'),('AS0038','Rousseau Paredes, Jean-Jacques'),
('AS0039','Voltaire Salas, François-Marie'),('AS0040','Descartes Quispe, René'),
-- Escritores adicionales
('AS0041','Austen Torres, Jane Cassandra'),('AS0042','Brontë Flores, Charlotte Emily'),
('AS0043','Dickens López, Charles John'),('AS0044','Tolstói Mendoza, León Nikolái'),
('AS0045','Dostoyevski Vargas, Fiódor Mikhailovich'),('AS0046','Poe Ríos, Edgar Allan'),
('AS0047','Wilde Huanca, Oscar Fingal'),('AS0048','Joyce Mamani, James Augustine'),
('AS0049','Woolf Chávez, Virginia Adeline'),('AS0050','Hemingway Paredes, Ernest Miller'),
('AS0051','Faulkner Salas, William Cuthbert'),('AS0052','Steinbeck Quispe, John Ernst'),
('AS0053','Camus Torres, Albert René'),('AS0054','Sartre Flores, Jean-Paul Charles'),
('AS0055','Proust López, Marcel Valentin'),('AS0056','Kafka Mendoza, Franz Josef'),
('AS0057','Mann Vargas, Thomas Johann'),('AS0058','Zweig Ríos, Stefan'),
('AS0059','Hesse Huanca, Hermann Karl'),('AS0060','Mishima Mamani, Yukio Kimitake'),
-- Héroes nacionales peruanos y latinoamericanos
('AS0061','Túpac Amaru Quispe, José Gabriel'),('AS0062','Pumacahua Torres, Mateo García'),
('AS0063','Cáceres Flores, Andrés Avelino'),('AS0064','Grau López, Miguel María'),
('AS0065','Bolognesi Mendoza, Francisco de Paula'),('AS0066','Quiñones Vargas, José Abelardo'),
('AS0067','Ugarte Ríos, Alfonso'),('AS0068','Leguía Huanca, Augusto Bernardino'),
('AS0069','Sucre Mamani, Antonio José de'),('AS0070','Miranda Chávez, Francisco de'),
-- Científicos y pensadores
('AS0071','Newton Torres, Isaac'),('AS0072','Einstein Flores, Albert Hermann'),
('AS0073','Darwin López, Charles Robert'),('AS0074','Curie Mendoza, Marie Sklodowska'),
('AS0075','Pasteur Vargas, Louis'),('AS0076','Galileo Ríos, Galilei'),
('AS0077','Tesla Huanca, Nikola'),('AS0078','Hawking Mamani, Stephen William'),
('AS0079','Turing Chávez, Alan Mathison'),('AS0080','Lovelace Paredes, Ada Augusta');

-- ============================================================
-- BLOQUE 16: NIVEL DE ASESOR
-- ============================================================
INSERT INTO DASESORNIVEL (CODASESORNIVEL, NOMASESORNIVEL) VALUES
('NV1','Asesor Junior'),
('NV2','Asesor Senior'),
('NV3','Asesor Especialista'),
('NV4','Asesor Máster');

-- ============================================================
-- BLOQUE 17: CARGO PERSONAL
-- ============================================================
INSERT INTO DCARGOPERSONAL (CODCARGOPERSONAL, DESCARGOPERSONAL) VALUES
('G01','Gerente Central'),
('G02','Gerente de Área'),
('F01','Jefe de Negocios Regional'),
('F02','Administrador de Agencia'),
('F03','Jefe de Operaciones'),
('F04','Jefe de Riesgos'),
('F05','Funcionario de Créditos'),
('E01','Asesor de Negocios'),
('E02','Asistente de Operaciones'),
('E03','Analista de Créditos'),
('E04','Auxiliar de Operaciones'),
('E05','Ejecutivo de Ahorros'),
('E06','Asistente Administrativo'),
('E07','Analista de Sistemas');

-- ============================================================
-- BLOQUE 18: DIMENSIONES DE CRÉDITO
-- ============================================================
INSERT INTO DPRODUCTO (CODTIPOCREDITO, CODPRODUCTO, CODSUBPRODUCTO, DESTIPOCREDITO, DESPRODUCTO, DESSUBPRODUCTO, DESSUBTIPOPRODUCTO, FECHAINICIOVIG, FLAGACTIVO) VALUES
('01','01','01','Crédito Microempresa','Crédito MES','MES General','Microempresa General','2000-01-01','1'),
('01','01','02','Crédito Microempresa','Crédito MES','MES Agropecuario','Microempresa Agropecuaria','2000-01-01','1'),
('01','01','03','Crédito Microempresa','Crédito MES','MES Comercio','Microempresa Comercio','2000-01-01','1'),
('02','01','01','Crédito Pequeña Empresa','Crédito PYME','PYME General','Pequeña Empresa General','2000-01-01','1'),
('02','01','02','Crédito Pequeña Empresa','Crédito PYME','PYME Comercio','Pequeña Empresa Comercio','2000-01-01','1'),
('02','01','03','Crédito Pequeña Empresa','Crédito PYME','PYME Servicios','Pequeña Empresa Servicios','2000-01-01','1'),
('02','01','04','Crédito Pequeña Empresa','Crédito PYME','PYME Producción','Pequeña Empresa Producción','2005-01-01','1'),
('03','01','01','Crédito Consumo','Crédito Consumo','Consumo Revolvente','Consumo Tarjeta','2000-01-01','1'),
('03','01','02','Crédito Consumo','Crédito Consumo','Consumo No Revolvente','Consumo Personal','2000-01-01','1'),
('03','01','03','Crédito Consumo','Crédito Convenio','Convenio Institucional','Descuento por Planilla','2003-01-01','1'),
('04','01','01','Crédito Hipotecario','Crédito Hipotecario','Hipotecario Vivienda','Hipotecario MiVivienda','2002-01-01','1'),
('04','01','02','Crédito Hipotecario','Crédito Hipotecario','Hipotecario Construcción','Autoconstrucción','2005-01-01','1'),
('05','01','01','Crédito Mediana Empresa','Crédito Mediana Empresa','Mediana Empresa General','Mediana Empresa','2008-01-01','1'),
('06','01','01','Crédito Gran Empresa','Crédito Gran Empresa','Gran Empresa General','Gran Empresa','2010-01-01','1');

INSERT INTO DMODALIDAD (CODMODALIDAD, DESMODALIDAD) VALUES
('01','Cuota Fija'),('02','Cuota Variable'),('03','Balloon'),
('04','Libre Amortización'),('05','Al Vencimiento');

INSERT INTO DTIPOTASA (CODTIPOTASA, DESTIPOTASA) VALUES
('01','Tasa Efectiva Anual'),('02','Tasa Nominal Mensual'),
('03','Tasa Nominal Anual'),('04','Tasa Efectiva Mensual');

INSERT INTO DGRUPOCREDITO (CODGRUPOCREDITO, DESGRUPOCREDITO) VALUES
('01','Crédito Individual'),('02','Crédito Grupal'),
('03','Banca Comunal'),('04','Crédito Solidario');

INSERT INTO DESTADOCREDITO (CODESTADOCREDITO, DESESTADOCREDITO) VALUES
('01','Vigente'),('02','Vencido'),('03','En Cobranza Judicial'),
('04','Refinanciado'),('05','Reestructurado'),('06','Reprogramado'),
('07','Castigado'),('08','Cancelado');

INSERT INTO DCONDICIONCONTABLE (CODCONDICIONCONTABLE, DESCONDICIONCONTABLE) VALUES
('01','Vigente Normal'),('02','Vigente con Riesgo Potencial'),
('03','Deficiente'),('04','Dudoso'),('05','Pérdida'),
('06','Castigado');

INSERT INTO DCALIFICACIONCREDITICIA (CODCALIFICACIONCREDITICIA, DESCALIFICACIONCREDITICIA) VALUES
('0','Normal'),('1','Con Problemas Potenciales (CPP)'),
('2','Deficiente'),('3','Dudoso'),('4','Pérdida');

INSERT INTO DRECURSO (CODRECURSO, DESRECURSO) VALUES
('CAP','Capital Propio'),('BID','BID Invest'),
('AFD','Agencia Francesa de Desarrollo'),('KFW','KfW Alemania'),
('CAF','CAF Banco de Desarrollo'),('IFC','International Finance Corporation'),
('SBS','Fondo SBS'),('FND','Fondos Nacionales');

INSERT INTO DSUBRECURSO (CODSUBRECURSO, DESSUBRECURSO, PKRECURSO) VALUES
('CAP01','Capital Propio Ordinario',(SELECT PKRECURSO FROM DRECURSO WHERE CODRECURSO='CAP')),
('BID01','Línea BID Microempresa',(SELECT PKRECURSO FROM DRECURSO WHERE CODRECURSO='BID')),
('BID02','Línea BID Agropecuaria',(SELECT PKRECURSO FROM DRECURSO WHERE CODRECURSO='BID')),
('AFD01','Línea AFD Verde',(SELECT PKRECURSO FROM DRECURSO WHERE CODRECURSO='AFD')),
('IFC01','Línea IFC Inclusión',(SELECT PKRECURSO FROM DRECURSO WHERE CODRECURSO='IFC'));

INSERT INTO DNIVELAPROBACION (CODNIVELAPROBACION, DESNIVELAPROBACION, MONTOMINIMO, MONTOMAXIMO) VALUES
('N1','Asesor de Negocios',0,10000),
('N2','Administrador de Agencia',10001,50000),
('N3','Jefe de Negocios Regional',50001,150000),
('N4','Comité de Créditos Agencia',150001,500000),
('N5','Comité de Créditos Central',500001,1500000),
('N6','Directorio',1500001,9999999999);

INSERT INTO DCOMITE (CODCOMITE, DESCOMITE) VALUES
('C1','Comité Asesor'),('C2','Comité Agencia'),
('C3','Comité Zonal'),('C4','Comité Central'),('C5','Comité de Directorio');

INSERT INTO DCANALDESEMBOLSO (CODCANALDESEMBOLSO, DESCANALDESEMBOLSO) VALUES
('01','Efectivo en Caja'),('02','Abono en Cuenta de Ahorros'),
('03','Cheque de Gerencia'),('04','Transferencia Interbancaria'),
('05','CCI Interbancario');

INSERT INTO DADEUDADO (CODADEUDADO, DESADEUDADO) VALUES
('01','Sin Adeudado'),('02','Con Adeudado Vigente'),
('03','Con Adeudado Vencido');

INSERT INTO DGARANTIA (CODTIPOGARANTIA, DESTIPOGARANTIA, CODCLASE, DESCLASE, CODTIPOCLASE, DESTIPOCLASE, CODSUBTIPOCLASE, DESSUBTIPOCLASE) VALUES
('G01','Garantía Hipotecaria','H','Hipoteca','H1','Primera Hipoteca','H1A','Inmueble Urbano'),
('G02','Garantía Hipotecaria Rural','H','Hipoteca','H1','Primera Hipoteca','H1B','Inmueble Rural'),
('G03','Garantía Prendaria','P','Prenda','P1','Prenda Mercantil','P1A','Vehículo'),
('G04','Garantía Prendaria Maquinaria','P','Prenda','P1','Prenda Mercantil','P1B','Maquinaria'),
('G05','Garantía Personal','GP','Garantía Personal','GP1','Aval','GP1A','Persona Natural'),
('G06','Sin Garantía','SG','Sin Garantía','SG1','Sin Garantía','SG1A','No Aplica');

INSERT INTO DMODALIDADPAGO (CODMODALIDADPAGO, DESMODALIDADPAGO) VALUES
('01','Mensual'),('02','Bimestral'),('03','Trimestral'),
('04','Semestral'),('05','Anual'),('06','Quincenal'),('07','Semanal');

INSERT INTO DESTADODESEMBOLSO (CODESTADODESEMBOLSO, DESESTADODESEMBOLSO) VALUES
('01','Pendiente'),('02','Desembolsado'),('03','Cancelado'),('04','Observado');

INSERT INTO DSOLICITUDESTADO (CODSOLICITUDESTADO, DESSOLICITUDESTADO) VALUES
('01','En Evaluación'),('02','Aprobado'),('03','Rechazado'),
('04','Desembolsado'),('05','Anulado'),('06','En Comité');

INSERT INTO DSOLICITUDSITUACION (CODSOLICITUDSITUACION, DESSOLICITUDSITUACION) VALUES
('01','Nueva Solicitud'),('02','Renovación'),('03','Ampliación'),
('04','Refinanciamiento'),('05','Reestructuración');

-- ============================================================
-- BLOQUE 19: DIMENSIONES DE AHORROS Y OPERACIONES
-- ============================================================
INSERT INTO DPRODUCTOAHORRO (CODTIPOPRODUCTO, CODTIPOSUBPRODUCTO, CODCARACTERISTICA, DESTIPOPRODUCTO, DESTIPOSUBPRODUCTO, DESCARACTERISTICA) VALUES
('AC','01','01','Ahorro Corriente','Ahorro Básico','Sin costo de mantenimiento'),
('AC','01','02','Ahorro Corriente','Ahorro Plus','Con interés preferencial'),
('AC','02','01','Ahorro Corriente','Cuenta Sueldo','Depósito de haberes'),
('AC','03','01','Ahorro Corriente','Cuenta Mujer Emprendedora','TEA 2%, sin mantenimiento'),
('PF','01','01','Plazo Fijo','Depósito a Plazo','30 a 1800 días'),
('PF','01','02','Plazo Fijo','Depósito Grow','Con capitalización de intereses'),
('CT','01','01','CTS','CTS Clásico','Compensación por tiempo de servicios'),
('AP','01','01','Ahorro Programado','Ahorro Hormiga','Cuotas fijas mensuales'),
('AP','01','02','Ahorro Programado','Ahorro Meta','Con incentivo al cumplimiento');

INSERT INTO DTIPOCUENTAAHORRO (CODTIPOCUENTAAHORRO, DESTIPOCUENTAAHORRO) VALUES
('AC','Ahorro Corriente'),('PF','Plazo Fijo'),
('CT','CTS'),('AP','Ahorro Programado');

INSERT INTO DTIPOTASAAHORRO (CODTIPOTASAAHORRO, DESTIPOTASAAHORRO) VALUES
('TF','Tasa Fija'),('TV','Tasa Variable'),('TP','Tasa Preferencial');

INSERT INTO DESTADOCUENTA (CODESTADOCUENTA, DESESTADOCUENTA, ESTADO) VALUES
('01','Activa','1'),('02','Inactiva','0'),
('03','Bloqueada','0'),('04','Cerrada','0'),('05','En Proceso de Cierre','0');

INSERT INTO DAUXILIAR (CODAUXILIAR, NOMAUXILIAR) VALUES
('AUX001','Caja Principal'),('AUX002','Caja Secundaria'),
('AUX003','Caja Express'),('AUX004','Bóveda Central'),
('AUX005','Agente Corresponsal');

INSERT INTO DOPERADOR (CODOPERADOR, NOMOPERADOR) VALUES
('VISA','Visa / Niubiz'),('MAST','Mastercard'),
('PLIN','Yape / Plin'),('YAPE','Yape BCP'),
('BVPE','BBVA Perú'),('IBKP','Interbank Perú'),
('SCBK','Scotiabank Perú'),('BNCN','Banco de la Nación');

INSERT INTO DCONCEPTOOPERACION (CODCONCEPTOOPERACION, DESCONCEPTOOPERACION) VALUES
('DCAP','Desembolso Capital'),('PCAP','Pago Capital'),
('PINT','Pago Interés Compensatorio'),('PMOR','Pago Interés Moratorio'),
('PGAS','Pago Gastos'),('DAHO','Depósito Ahorro'),
('RAHO','Retiro Ahorro'),('PSER','Pago Servicio'),
('TRAN','Transferencia'),('GIRO','Giro Nacional'),
('COMI','Cobro Comisión'),('AJUS','Ajuste Contable');

INSERT INTO DTIPOOPERACION (CODTIPOOPERACION, DESTIPOOPERACION) VALUES
('CRE','Crédito / Abono'),('DEB','Débito / Cargo'),
('TRF','Transferencia'),('PAG','Pago Servicio'),
('GIR','Giro'),('AJU','Ajuste');

INSERT INTO DMEDIOPAGO (CODMEDIOPAGO, DESMEDIOPAGO) VALUES
('EFE','Efectivo'),('CHQ','Cheque'),
('TRF','Transferencia Bancaria'),('APP','App Móvil'),
('WEB','Portal Web'),('CAJ','Cajero Automático'),
('AGE','En Agencia'),('CCI','CCI Interbancario');

INSERT INTO DCANALTRANSACCIONAL (CODCANALTRANSACCIONAL, DESCANALTRANSACCIONAL) VALUES
('VEN','Ventanilla Agencia'),('CAJ','Cajero Automático ATM'),
('WEB','Portal Web HomeB'),('APP','Aplicación Móvil'),
('AGT','Agente Corresponsal'),('TEL','Banca Telefónica'),
('USR','Oficina Principal');

INSERT INTO DDEBITOAUTOMATICO (CODDEBITOAUTOMATICO, DESDEBITOAUTOMATICO) VALUES
('CUO','Cuota de Crédito'),('SER','Pago de Servicio'),
('SEG','Seguro'),('AHO','Ahorro Programado');

INSERT INTO DCANALGIRO (CODCANALGIRO, DESCANALGIRO) VALUES
('INT','Interno - entre agencias'),('WU','Western Union'),
('MG','MoneyGram'),('BN','Banco de la Nación');

INSERT INTO DESTADOGIRO (CODESTADOGIRO, DESESTADOGIRO) VALUES
('PE','Pendiente de Cobro'),('PA','Pagado'),
('CA','Cancelado'),('VE','Vencido');

INSERT INTO DENTIDADFINANCIERA (CODENTIDADFINANCIERA, DESENTIDADFINANCIERA) VALUES
('B001','BCP - Banco de Crédito del Perú'),
('B002','BBVA Perú'),
('B003','Scotiabank Perú'),
('B004','Interbank'),
('B005','BanBif'),
('B006','Banco Pichincha'),
('B007','Banco de la Nación'),
('CM01','CMAC Arequipa'),
('CM02','CMAC Cusco'),
('CM03','CMAC Piura'),
('CM04','CMAC Trujillo'),
('CM05','CMAC Ica'),
('CR01','CRAC Los Andes'),
('FN01','Financiera Compartamos'),
('FN02','Mibanco'),
('FN03','Financiera Confianza'),
('FN04','Crediscotia');

-- ============================================================
-- BLOQUE 20: METAS — TIPO DE CRÉDITO
-- ============================================================
INSERT INTO DTIPOCREDITO (CODTIPOCREDITO, DESTIPOCREDITO) VALUES
('ME','Microempresa'),
('PE','Pequeña Empresa'),
('CO','Consumo'),
('HI','Hipotecario'),
('MD','Mediana Empresa'),
('GE','Gran Empresa');

COMMIT;
