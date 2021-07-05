<?php

namespace paupololi\sheetsformbuilder\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client as GuzzleClient;
use Auth;
use Validator;


class SheetsController extends Controller
{

    public function init(Request $request){

        if (env('SHEETS_EXTERNAL') || !Auth::user()) {

            $this->clientBuilder = [
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('SHEETS_API_URL'),
            ];
            $this->clientBuilder['headers'] = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];

        }else{

            $this->clientBuilder = [
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('APP_URL'),
            ];
            $this->clientBuilder['headers'] = collect($request->header())->transform(function ($item) {
                return $item[0];
            })->toArray();
        }

    }
    
    public function index($id,Request $request)
    {
        $this->init($request);

        $endpoint = "form/{$id}";
        $response = null;
        
        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return $response->getBody()->getContents();
    }

    public function getrecord($entityname,$recordid,Request $request)
    {
        $this->init($request);

        $endpoint =  'entity/data/' . $entityname . '/' . $recordid;
        
        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return $response->getBody()->getContents();
    }

    public function saveFile(Request $request)
    {
        $this->init($request);

        try {

            $id = $request->fileId;
            $file = $request->file('file');
            $name = $file->getClientOriginalName();
            $file->move(storage_path('app'), $name);
            $path =  storage_path('app')."/{$name}";

            $endpoint = 'document';
            $this->clientBuilder['headers']["Content-Type"] = "multipart/form-data" ;
            $client = new GuzzleClient($this->clientBuilder);

            $r = $client->request('POST', $endpoint, [
                'multipart' => [
                    [
                        'contents' => file_get_contents($path),
                        'name' => 'file',
                        'filename' => $name
                    ]
                ]
            ]);
            $res          = new \stdClass();
            $res->success = $r->getStatusCode() === 200;
            $res->content = json_decode($r->getBody()->getContents());
            $res->status  = $r->getStatusCode();

            return response()->json($res);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function sendForm(Request $request)
    {
        $this->init($request);

        try {

            $entity = new \stdClass();
            $entity_key = $request->entityKey;
            $entity->$entity_key = \json_decode($request->$entity_key);
            
            $endpoint = 'entity';
            $this->clientBuilder[\GuzzleHttp\RequestOptions::JSON] = $entity;
            $client   = new GuzzleClient($this->clientBuilder);

            $r = $client->request('post', $endpoint);
            
            $res          = new \stdClass();
            $res->success = $r->getStatusCode() === 200;
            $res->content = json_decode($r->getBody()->getContents());
            $res->status  = $r->getStatusCode();

            return response()->json($res, $res->status);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => json_encode($th->getMessage())]);
        }
    }

    public function sendFormUpdate(Request $request)
    {
        $this->init($request);

        try {

            $entity = new \stdClass();
            $entity_key = $request->entityKey;
            $entity->$entity_key = \json_decode($request->$entity_key);

            $endpoint = 'entity';
            $this->clientBuilder[\GuzzleHttp\RequestOptions::JSON] = $entity;
            $client   = new GuzzleClient($this->clientBuilder);

            $r = $client->request('post', $endpoint);

            $res          = new \stdClass();
            $res->success = $r->getStatusCode() === 200;
            $res->content = json_decode($r->getBody()->getContents());
            $res->status  = $r->getStatusCode();

            return response()->json($res, $res->status);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function entity_info($id,Request $request)
    {
        $this->init($request);

        try {

            $endpoint = "entity/info/{$id}";
            $client   = new GuzzleClient($this->clientBuilder);
            
            $res = $client->request('GET', $endpoint);

            $response          = new \stdClass();
            $response->success = $res->getStatusCode() === 200;
            $response->content = json_decode($res->getBody()->getContents());
            $response->status  = $res->getStatusCode();

            return response()->json($response, $response->status);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }
}