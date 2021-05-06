<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client as GuzzleClient;

use Validator;

class SheetsController extends Controller
{
    private $headers, $client;

    public function __construct()
    {
        if (env('SHEETS_EXTERNAL')) {
            $this->headers = [
                'Content-Type' => 'application/json',
                'AccessToken' => 'key',
                'Authorization' => env('SECURITY_BEARER'),
            ];

            $this->client = new GuzzleClient([
                'headers' => $this->headers,
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('SHEETS_API_URL')
            ]);
        }
        else {
            app('session')->regenerate();

            $this->headers = [
                'X-CSRF-TOKEN' => csrf_token()
            ];

            $this->client = new GuzzleClient([
                'headers' => $this->headers,
                'http_errors' => false,
                'verify' => false,
                'base_uri' => env('APP_URL'),
            ]);
        }
    }

    public function index($id)
    {
        $endpoint = "form/{$id}";
        $response = $this->client->request('GET', $endpoint);

        return $response->getBody()->getContents();;
    }

    public function getrecord($entityname,$recordid)
    {
        $endpoint =  'entity/data/' . $entityname . '/' . $recordid;

        $response = $this->client->request('GET', $endpoint);

        return $response->getBody()->getContents();;
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
            $endpoint = 'document';

            $data =  [
                'multipart' => [
                    [
                        'contents' => file_get_contents($path),
                        'name' => 'file',
                        'filename' => $name
                    ]
                ]
            ];
            $r = $this->client->request($method, $endpoint, $data);

            $status = $r->getStatusCode();

            $response = $r->getBody()->getContents();

            if($status === 200)
                return response()->json(['success' => true, 'content' => $response]);

            else
                return response()->json(['success' => false, 'content' => json_decode($response)]);

            return response()->json(json_decode($response));

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

            $endpoint =  'entity';

            $response = null;

            $r = $this->client->request('POST', $endpoint);

            $status = $r->getStatusCode();

            $response = $r->getBody()->getContents();

            if($status === 200)
                return response()->json(['success' => true, 'content' => $response]);
            else
                return response()->json(['success' => false, 'content' => json_decode($response)]);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function sendFormUpdate(Request $request)
    {
        try {
            $entity_key = $request->entityKey;
            $entity = new \stdClass();
            $entity->$entity_key = \json_decode($request->$entity_key);

            $method = 'post';
            $endpoint = 'entity';

            $r = $this->client->request($method, $endpoint);

            $status = $r->getStatusCode();

            $response = $r->getBody()->getContents();

            if($status === 200)
                return response()->json(['success' => true, 'content' => $response]);
            else
                return response()->json(['success' => false, 'content' => json_decode($response)]);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'content' => $th->getMessage()]);
        }
    }

    public function entity_info($id)
    {
        $endpoint = "entity/info/{$id}";

        $res = $this->client->request('GET', $endpoint);
        return response()->json([
            'success' => true,
            'content' => $res->getBody()->getContents()
        ]);
    }
}
