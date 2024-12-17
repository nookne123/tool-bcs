import './App.css';
import {useState} from "react";

function App() {
  const [inputLog, setInputLog] = useState('');
  const [outputConsume, setOutputConsume] = useState('');
  const [outPutGetInteractive, setOutPutGetInteractive] = useState('');
  const [outputProducing, setOutputProducing] = useState('');
  const [outputProduced, setOutputProduced] = useState('');
  const [outputSummaryLog, setOutputSummaryLog] = useState('');
  const [outputException, setOutputException] = useState('');

  const [outputConsumeMsg, setOutputConsumeMsg] = useState('');
  const [outPutGetInteractiveMsg, setOutPutGetInteractiveMsg] = useState('');
  const [outputProducingMsg, setOutputProducingMsg] = useState('');
  const [outputProducedMsg, setOutputProducedMsg] = useState('');
  const [outputExceptionMsg, setOutputExceptionMsg] = useState('');

  const [isKafkaConsumeChecked, setIsKafkaConsumeChecked] = useState(false);
  const [isHTTPInteractiveChecked, setIsHTTPInteractiveChecked] = useState(false);
  const [isHTTPUsageDetailChecked, setIsHTTPUsageDetailChecked] = useState(false);
  const [isKafkaProducingChecked, setIsKafkaProducingChecked] = useState(false);
  const [isKafkaProducedChecked, setIsKafkaProducedChecked] = useState(false);
  const [isSummaryLogChecked, setIsSummaryLogChecked] = useState(false);
  const [isAppLogicChecked, setIsAppLogicChecked] = useState(false);
  const [isExceptionChecked, setIsExceptionChecked] = useState(false);

  const [outputGetUsageDetailList, setOutputGetUsageDetailList] = useState([]);
  const [outputAppLogicList, setOutputAppLogicList] = useState([]);

  const lines = inputLog.split('\n'); // แบ่ง inputLog เป็น array ของแต่ละบรรทัด

  const handleConvert = () => {
    let usageDetailList = [];
    let appLogicList = [];
    setOutPutGetInteractive('');
    setOutPutGetInteractiveMsg('');
    setOutputConsume('');
    setOutputConsumeMsg('');
    setOutputProducing('');
    setOutputProduced('');
    setOutputProducedMsg('');
    setOutputSummaryLog('');
    setOutputException('');
    setOutputExceptionMsg('');

    setIsKafkaConsumeChecked(false);
    setIsHTTPInteractiveChecked(false);
    setIsHTTPUsageDetailChecked(false);
    setIsKafkaProducingChecked(false);
    setIsKafkaProducedChecked(false);
    setIsSummaryLogChecked(false);
    setIsAppLogicChecked(false);
    setIsExceptionChecked(false);

    lines.forEach(line => {
      try {
        const log = JSON.parse(line); // แปลงบรรทัดเป็น JSON
        if (log.actionDescription && log.actionDescription.includes('receive http response from getInteractive')) {
          setIsHTTPInteractiveChecked(true)
          if (log.message === "" || log.message === null) {
            setOutPutGetInteractiveMsg('ไม่มีค่า');
          } else {
            setOutPutGetInteractiveMsg(log.message);
          }
          // log.message = 'ดูค่าข้างล่างจ้าาาา';
          setOutPutGetInteractive(formatJSON(log) + '\n')
        }
        if (log.actionDescription && log.actionDescription.includes('receive http response from GetUsageDeTail')) {
          setIsHTTPUsageDetailChecked(true)
          let buildGetUsageDetail = {};
          if (log.message === "" || log.message === null) {
            buildGetUsageDetail.message = 'ไม่มีค่า';
          } else {
            buildGetUsageDetail.message = log.message
          }
          buildGetUsageDetail.log = formatJSON(log) + '\n';
          usageDetailList.push(buildGetUsageDetail);
        }
        if (log.action && log.action.includes('[CONSUMING]')) {
          setIsKafkaConsumeChecked(true)
          setOutputConsumeMsg(formatJSON(JSON.parse(log.message.replace(/\\/g, ""))) + '\n'); // แปลงให้อยู่ในรูป JSON format
          setOutputConsume(formatJSON(log) + '\n')// ลบ backslashes
        }
        if (log.action && log.action.includes('[APP_LOGIC]')) {
          setIsAppLogicChecked(true)
          let buildAppLogic = {};
          if (log.message === "" || log.message === null) {
            buildAppLogic.message = 'ไม่มีค่า';
          } else {
            buildAppLogic.message = log.message
          }
          buildAppLogic.log = formatJSON(log) + '\n';
          appLogicList.push(buildAppLogic);
        }
        if (log.action && log.action.includes('[EXCEPTION]')) {
          setIsExceptionChecked(true)
          setOutputExceptionMsg(log.message); // แปลงให้อยู่ในรูป JSON format
          setOutputException(formatJSON(log) + '\n')// ลบ backslashes
        }
        if (log.action && log.action.includes('[PRODUCING]')) {
          setIsKafkaProducingChecked(true)
          setOutputProducingMsg(formatJSON(JSON.parse(log.message)) + '\n');
          setOutputProducing(formatJSON(log) + '\n')// ลบ backslashes
        }
        if (log.action && log.action.includes('[PRODUCED]')) {
          setIsKafkaProducedChecked(true)
          setOutputProducedMsg(formatJSON(JSON.parse(log.message.replace(/\\/g, ""))) + '\n'); // แปลงให้อยู่ในรูป JSON format
          setOutputProduced(formatJSON(log) + '\n')// ลบ backslashes
        }
        if (log.recordType && log.recordType.includes('summary')) {
          setIsSummaryLogChecked(true)
          setOutputSummaryLog(formatJSON(log) + '\n')// ลบ backslashes
        }

        setOutputGetUsageDetailList(usageDetailList)
        setOutputAppLogicList(appLogicList)
      } catch (error) {
        console.error('Error parsing line:', line);
      }
    });
  };

  const handleReset = () => {
    setInputLog('');
    setOutPutGetInteractive('');
    setOutPutGetInteractiveMsg('');
    setOutputConsume('');
    setOutputConsumeMsg('');
    setOutputProducing('');
    setOutputProducingMsg('');
    setOutputProduced('');
    setOutputProducedMsg('');
    setOutputSummaryLog('');
    setOutputException('');
    setOutputGetUsageDetailList([])
    setOutputAppLogicList([])

    setIsKafkaConsumeChecked(false);
    setIsHTTPInteractiveChecked(false);
    setIsHTTPUsageDetailChecked(false);
    setIsKafkaProducingChecked(false);
    setIsKafkaProducedChecked(false);
    setIsSummaryLogChecked(false);
    setIsAppLogicChecked(false)
    setIsExceptionChecked(false);

  };

  const formatJSON = (jsonObj) => {
    return JSON.stringify(jsonObj, null, 2);
  };

  return (
    <div className="text-center p-10 px-48">
      <div>

        <div className="py-4 font-bold text-6xl text-yellow-400">Unpack message สุดเทพ ของน้องเนเน่!</div>
        <div className="py-10 font-bold text-4xl text-pink-600 ">Input Text</div>
        <textarea
          type="text"
          value={inputLog}
          onChange={(e) => setInputLog(e.target.value)}
          className="border rounded border-black p-2 w-full h-[250px]"
        />
        <div className="flex justify-center mt-5 gap-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleConvert}
          >
            Convert
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="py-10 mt-10 font-bold text-4xl text-purple-700">Output</div>

      {/*---------------------------------------------------------------------------------------------*/}
      {/*------------------------------       Kafka Consume        -----------------------------------*/}
      {/*---------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isKafkaConsumeChecked}
          onChange={(e) => setIsKafkaConsumeChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Consume Msg</div>
      </label>
      <div className={`${isKafkaConsumeChecked && outputConsume === '' ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Consume Msg
      </div>
      <div
        className={`${isKafkaConsumeChecked && outputConsume !== '' ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
        <textarea
          type="text"
          value={outputConsume}
          readOnly
          className="border rounded border-black p-2 w-full h-[300px]"
        />
        <div className="font-bold text-xl text-black text-start py-4">message in Kafka Consume</div>
        <textarea
          className="w-full h-[250px]"
          value={outputConsumeMsg}
          readOnly
        />
      </div>

      {/*---------------------------------------------------------------------------------------------*/}
      {/*--------------------------------------  App Logic  ------------------------------------------*/}
      {/*---------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isAppLogicChecked}
          onChange={(e) => setIsAppLogicChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">App Logic Log</div>
      </label>
      <div
        className={`${isAppLogicChecked && outputAppLogicList.length === 0 ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล App Logic Log
      </div>
      {outputAppLogicList.map((item, index) => (
        <div
          className={`${isAppLogicChecked && outputAppLogicList.length !== 0 ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
          <div className="text-start font-bold">log: {index + 1}</div>
          <textarea
            type="text"
            value={item.log}
            readOnly
            className="border rounded border-black p-2 w-full h-[300px]"
          />
          <div className="font-bold text-xl text-black text-start py-4">message in App Logic</div>
          <textarea
            className="w-full h-[500px]"
            value={item.message}
            readOnly
          />
        </div>
      ))}

      {/*---------------------------------------------------------------------------------------------*/}
      {/*------------------------------  Get Interactive Response  -----------------------------------*/}
      {/*---------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isHTTPInteractiveChecked}
          onChange={(e) => setIsHTTPInteractiveChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Get Interactive Response</div>
      </label>
      <div
        className={`${isHTTPInteractiveChecked && outPutGetInteractive === '' ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Get Interactive Response
      </div>
      <div
        className={`${isHTTPInteractiveChecked && outPutGetInteractive !== '' ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
        <textarea
          type="text"
          value={outPutGetInteractive}
          readOnly
          className="border rounded border-black p-2 w-full h-[300px]"
        />
        <div className="font-bold text-xl text-black text-start py-4">message in xml Get Interactive</div>
        <textarea
          className="w-full h-[500px]"
          value={outPutGetInteractiveMsg}
          readOnly
        />
      </div>

      {/*---------------------------------------------------------------------------------------------*/}
      {/*------------------------------  Get UsageDetail Response  -----------------------------------*/}
      {/*---------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isHTTPUsageDetailChecked}
          onChange={(e) => setIsHTTPUsageDetailChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Get UsageDetail Response</div>
      </label>
      <div
        className={`${isHTTPUsageDetailChecked && outputGetUsageDetailList.length === 0 ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Get UsageDetail Response
      </div>
      {outputGetUsageDetailList.map((item, index) => (
        <div
          className={`${isHTTPUsageDetailChecked && outputGetUsageDetailList.length !== 0 ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
          <div className="text-start font-bold">response: {index + 1}</div>
          <textarea
            type="text"
            value={item.log}
            readOnly
            className="border rounded border-black p-2 w-full h-[300px]"
          />
          <div className="font-bold text-xl text-black text-start py-4">message in xml Get UsageDetail</div>
          <textarea
            className="w-full h-[500px]"
            value={item.message}
            readOnly
          />
        </div>
      ))}

      {/*----------------------------------------------------------------------------------------------*/}
      {/*------------------------------       Kafka Producing        -----------------------------------*/}
      {/*----------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isKafkaProducingChecked}
          onChange={(e) => setIsKafkaProducingChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Producing Msg</div>
      </label>
      <div
        className={`${isKafkaProducingChecked && outputProducing === '' ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Producing Msg
      </div>
      <div
        className={`${isKafkaProducingChecked && outputProducing !== '' ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
        <textarea
          type="text"
          value={outputProducing}
          readOnly
          className="border rounded border-black p-2 w-full h-[300px]"
        />
        <div className="font-bold text-xl text-black text-start py-4">message in Kafka Producing</div>
        <textarea
          className="w-full h-[250px]"
          value={outputProducingMsg}
          readOnly
        />
      </div>

      {/*----------------------------------------------------------------------------------------------*/}
      {/*------------------------------       Kafka Produced        -----------------------------------*/}
      {/*----------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isKafkaProducedChecked}
          onChange={(e) => setIsKafkaProducedChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Produced Msg</div>
      </label>
      <div
        className={`${isKafkaProducedChecked && outputProduced === '' ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Produced Msg
      </div>
      <div
        className={`${isKafkaProducedChecked && outputProduced !== '' ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
        <textarea
          type="text"
          value={outputProduced}
          readOnly
          className="border rounded border-black p-2 w-full h-[300px]"
        />
        <div className="font-bold text-xl text-black text-start py-4">message in Kafka Produced</div>
        <textarea
          className="w-full h-[250px]"
          value={outputProducedMsg}
          readOnly
        />
      </div>
      {/*---------------------------------------------------------------------------------------------*/}
      {/*------------------------------        Exception        -----------------------------------*/}
      {/*---------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isExceptionChecked}
          onChange={(e) => setIsExceptionChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Exception</div>
      </label>
      <div
        className={`${isExceptionChecked && outputException === '' ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Exception
      </div>
      <div
        className={`${isExceptionChecked && outputException !== '' ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
        <textarea
          type="text"
          value={outputException}
          readOnly
          className="border rounded border-black p-2 w-full h-[300px]"
        />
        <div className="font-bold text-xl text-black text-start py-4">message in Exception</div>
        <textarea
          className="w-full h-[250px]"
          value={outputExceptionMsg}
          readOnly
        />
      </div>

      {/*---------------------------------------------------------------------------------------------*/}
      {/*------------------------------        Summary Log         -----------------------------------*/}
      {/*---------------------------------------------------------------------------------------------*/}

      <label className="flex gap-2 text-xl text-black font-bold my-4">
        <input
          className="w-5"
          type="checkbox"
          checked={isSummaryLogChecked}
          onChange={(e) => setIsSummaryLogChecked(e.target.checked)}
        />
        <div className="text-red-500 text-2xl">Summary Log</div>
      </label>
      <div
        className={`${isSummaryLogChecked && outputSummaryLog === '' ? '' : 'hidden'} text-start text-yellow-300`}>
        ไม่พบข้อมูล Summary Log
      </div>
      <div
        className={`${isSummaryLogChecked && outputSummaryLog !== '' ? '' : 'hidden'} border rounded border-black p-4 bg-yellow-100`}>
        <textarea
          type="text"
          value={outputSummaryLog}
          readOnly
          className="border rounded border-black p-2 w-full h-[300px]"
        />
      </div>

    </div>


  );
}

export default App;
