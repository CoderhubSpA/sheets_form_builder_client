<?php

namespace paupololi\sheetsformbuilder\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client as GuzzleClient;

use Validator;


class SheetsController extends Controller
{
	public function __construct(Request $request)
    {
        if (env('SHEETS_EXTERNAL')) {
            $this->headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];

            $this->clientBuilder = [
                'headers' => $this->headers,
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('SHEETS_API_URL'),
            ];
        }
        else {
            $this->clientBuilder = [
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('APP_URL'),
            ];
        }
    }
	
    public function index($id,Request $request)
    {
       
        $method = 'get';
        $endpoint = "form/{$id}";
        $response = null;
	   
		if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }
      
      
        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return $response->getBody()->getContents();
    }

    public function getrecord($entityname,$recordid,Request $request)
    {
        $endpoint =  'entity/data/' . $entityname . '/' . $recordid;
        $response = null;
	        		
		 if (!env('SHEETS_EXTERNAL')) {
            $headers = collect($request->header())->transform(function ($item) {
                return $item[0];
            });

            $this->clientBuilder['headers'] = $headers->toArray();
        }
		
        $client = new GuzzleClient($this->clientBuilder);
        $response = $client->request('GET', $endpoint);

        return $response->getBody()->getContents();
    }

    public function saveFile(Request $request)
    {
        try {
            $id = $request->fileId;

            $file = $request->file('file');
            $name = $file->getClientOriginalName();

            $file->move(storage_path('app'), $name);

            $path =  storage_path('app')."/{$name}";

            $method = 'POST';
            $baseUrl = env('SHEETS_API_URL') . 'document';

            $headers = [
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
                "Content-Type" => "multipart/form-data"
            ];

            $client = new GuzzleClient([
                'headers' => $headers,
                'http_errors' => false,
                'verify' => false
            ]);

            $r = $client->request($method, $baseUrl, [
                'multipart' => [
                    [
                        'contents' => file_get_contents($path),
                        'name' => 'file',
                        'filename' => $name
                    ]
                ]
            ]);
            $res = new \stdClass();

            $res->success = $r->getStatusCode() === 200;
				  
            $res->content = json_decode($r->getBody()->getContents());

            return response()->json($res);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function sendForm(Request $request)
    {
        try {
            $entity_key = $request->entityKey;
            $entity = new \stdClass();
            $entity->$entity_key = \json_decode($request->$entity_key);
            $method = 'post';
            $baseUrl = env('SHEETS_API_URL') . 'entity';
            $response = null;
            $headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];
            $client = new GuzzleClient([
                'headers' => $headers,
                'http_errors' => false,
                'verify' => false,
                \GuzzleHttp\RequestOptions::JSON => $entity,
            ]);
            $r = $client->request($method, $baseUrl);
           $res = new \stdClass();

            $res->success = $r->getStatusCode() === 200;
            $res->content = json_decode($r->getBody()->getContents());
            $res->status = $r->getStatusCode();

            return response()->json($res, $r->getStatusCode());
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => json_encode($th->getMessage())]);
        }
    }

    public function sendFormUpdate(Request $request)
    {
        try {
            $entity_key = $request->entityKey;
            $entity = new \stdClass();
            $entity->$entity_key = \json_decode($request->$entity_key);
            $method = 'post';
            $baseUrl = env('SHEETS_API_URL') . 'entity';
            $response = null;
            $headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];
            // return response()->json(['success' => false, 'content' => [\GuzzleHttp\RequestOptions::JSON => $entity]]);
            $client = new GuzzleClient([
                'headers' => $headers,
                'verify' => false,
                'http_errors' => false,
                \GuzzleHttp\RequestOptions::JSON => $entity,
            ]);
            $r = $client->request($method, $baseUrl);
          $res = new \stdClass();

            $res->success = $r->getStatusCode() === 200;
            $res->content = json_decode($r->getBody()->getContents());
            $res->status = $r->getStatusCode();

            return response()->json($res, $r->getStatusCode());
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function entity_info($id)
    {
		 try {
        $endpoint = env('SHEETS_API_URL') . "entity/info/{$id}";
        $headers = [
            'Content-Type' => 'application/json',
            'AccessToken' => 'key',
            'Authorization' => env('SECURITY_BEARER'),
        ];
        $client = new GuzzleClient([
            'headers' => $headers,
            'http_errors' => false,
            'verify' => false,
        ]);
            $res = $client->request('GET', $endpoint);
            $response = new \stdClass();

            $response->success = $res->getStatusCode() === 200;
            $response->content = json_decode($res->getBody()->getContents());
            $response->status = $res->getStatusCode();

            return response()->json($response, $response->status);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }
}